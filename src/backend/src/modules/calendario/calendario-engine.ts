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

  private getDaysDifference(date1: string, date2: string): number {
    const [y1, m1, d1] = date1.split('-').map(Number);
    const [y2, m2, d2] = date2.split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    return Math.round(Math.abs(utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  private calcularPuntuacionDispersion(
    fechaPropuesta: string,
    gradoId: number,
    curso: number,
    asignados: Examen[]
  ): number {
    let puntuacion = 0;

    for (const ex of asignados) {
      if (ex.asignatura?.gradoId !== gradoId || ex.asignatura?.curso !== curso || !ex.fecha) {
        continue;
      }

      const diffDias = this.getDaysDifference(fechaPropuesta, ex.fecha);

      if (diffDias === 0) {
        puntuacion -= 100;
      } else if (diffDias === 1) {
        puntuacion -= 50;  
      } else if (diffDias === 2) {
        puntuacion -= 20;  
      } else if (diffDias === 3) {
        puntuacion -= 5; 
      }
    }

    return puntuacion;
  }

  private buscarSlotOptimo(
    examen: Examen,
    slots: Slot[],
    aulas: Aula[],
    profesores: Profesor[],
    asignados: Examen[]
  ): { slot: Slot; aula: Aula } | null {
    let mejorAsignacion: { slot: Slot; aula: Aula; profesor: Profesor; puntuacion: number } | null = null;
    const gradoId = examen.asignatura?.gradoId;
    const curso = examen.asignatura?.curso || 1;

    const candidatos = profesores.filter(p => p.puedeImpartirAsignatura(examen.asignaturaId));
    const profesoresAEvaluar = examen.profesor ? [examen.profesor] : candidatos;

    if (profesoresAEvaluar.length === 0) {
      return null;
    }

    for (const slot of slots) {
      const puntuacion = gradoId 
        ? this.calcularPuntuacionDispersion(slot.fecha, gradoId, curso, asignados)
        : 0;

      if (mejorAsignacion && puntuacion <= mejorAsignacion.puntuacion) {
        continue;
      }

      for (const aula of aulas) {
        if (!aula.tieneCapacidadSuficiente(examen.totalAlumnos)) continue;
        if (!aula.estaDisponibleEn(slot.fecha, slot.franja, asignados)) continue;

        const profesorDisponible = profesoresAEvaluar.find(p => 
          p.estaDisponibleEn(slot.fecha, slot.franja, p.preferencias) && 
          !p.tieneCruceHorario(slot.fecha, slot.franja, asignados)
        );

        if (!profesorDisponible) {
          continue;
        }

        if (!mejorAsignacion || puntuacion > mejorAsignacion.puntuacion) {
          mejorAsignacion = {
            slot,
            aula,
            profesor: profesorDisponible,
            puntuacion
          };

          if (puntuacion === 0) {
            examen.profesor = mejorAsignacion.profesor;
            return { slot: mejorAsignacion.slot, aula: mejorAsignacion.aula };
          }
        }
      }
    }

    if (mejorAsignacion) {
      examen.profesor = mejorAsignacion.profesor;
      return { slot: mejorAsignacion.slot, aula: mejorAsignacion.aula };
    }

    return null;
  }
}
