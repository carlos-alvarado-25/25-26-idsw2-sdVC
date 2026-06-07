import { Examen } from '../../entities/examen.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Preferencia } from '../../entities/preferencia.entity';
import { GeneracionResultDto, ConflictInfo } from './dto/generacion-result.dto';

export interface GeneracionConfig {
  examenesPendientes: Examen[];
  aulas: Aula[];
  profesores: Profesor[];
  preferencias: Preferencia[];
  fechaInicio: string;
  fechaFin: string;
  franjasHorarias: string[];
  examenesExistentes?: Examen[];
}

interface Slot {
  fecha: string;
  franja: string;
}

export class CalendarioEngine {
  generar(config: GeneracionConfig): { result: GeneracionResultDto; examenesProgramados: Examen[] } {
    const { examenesPendientes, aulas, profesores, preferencias, fechaInicio, fechaFin, franjasHorarias, examenesExistentes = [] } = config;
    const examenesProgramados: Examen[] = [];
    const conflictos: ConflictInfo[] = [];

    const slots = this.generarSlotsTemporales(fechaInicio, fechaFin, franjasHorarias);

    profesores.forEach(p => {
      p.preferencias = preferencias.filter(pref => pref.profesorId === p.id);
    });

    for (const examen of examenesPendientes) {
      const asignacionesParaValidar = [...examenesExistentes, ...examenesProgramados];
      const asignacion = this.buscarSlotOptimo(examen, slots, aulas, profesores, asignacionesParaValidar);

      if (asignacion) {
        examen.fecha = asignacion.slot.fecha;
        const [horaInicio, horaFin] = asignacion.slot.franja.split('-');
        examen.hora = horaInicio;
        examen.aula = asignacion.aula;
        examen.aulaId = asignacion.aula.id;
        
        if (examen.profesor) {
          examen.profesorId = examen.profesor.id;
        }
        
        examenesProgramados.push(examen);
      } else {
        conflictos.push({
          examenId: examen.id,
          examenCodigo: examen.codigo,
          asignaturaNombre: examen.nombreAsignatura,
          motivo: 'Sin slots o aulas disponibles con capacidad suficiente sin cruces horarios',
        });
      }
    }

    const totalExamenes = examenesPendientes.length;
    const programados = examenesProgramados.length;
    const noProgramados = conflictos.length;

    return {
      result: {
        exito: noProgramados === 0,
        totalExamenes,
        programados,
        noProgramados,
        conflictos,
      },
      examenesProgramados,
    };
  }

  private generarSlotsTemporales(inicio: string, fin: string, franjas: string[]): Slot[] {
    const slots: Slot[] = [];
    const fechaActual = new Date(inicio);
    const fechaFin = new Date(fin);

    while (fechaActual <= fechaFin) {
      const diaSemana = fechaActual.getDay();
      if (diaSemana >= 1 && diaSemana <= 5) {
        const fechaStr = fechaActual.toISOString().split('T')[0];
        for (const franja of franjas) {
          slots.push({ fecha: fechaStr, franja });
        }
      }
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    return slots;
  }

  private buscarSlotOptimo(
    examen: Examen,
    slots: Slot[],
    aulas: Aula[],
    profesores: Profesor[],
    asignados: Examen[]
  ): { slot: Slot; aula: Aula } | null {
    for (const slot of slots) {
      for (const aula of aulas) {
        if (!aula.tieneCapacidadSuficiente(examen.totalAlumnos)) continue;
        if (!aula.estaDisponibleEn(slot.fecha, slot.franja, asignados)) continue;

        const candidatos = profesores.filter(p => p.asignaturas?.some(a => a.id === examen.asignaturaId));
        const profesoresAEvaluar = examen.profesor ? [examen.profesor] : candidatos;

        if (profesoresAEvaluar.length > 0) {
          const profesorDisponible = profesoresAEvaluar.find(p => 
            p.estaDisponibleEn(slot.fecha, slot.franja, p.preferencias) && 
            !p.tieneCruceHorario(slot.fecha, slot.franja, asignados)
          );

          if (!profesorDisponible) {
            continue;
          }

          examen.profesor = profesorDisponible;
        }

        return { slot, aula };
      }
    }
    return null;
  }
}
