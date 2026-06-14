import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Examen } from '../../../entities/examen.entity';
import { Profesor } from '../../../entities/profesor.entity';
import { Preferencia } from '../../../entities/preferencia.entity';
import { TimeUtils } from '../../../common/utils/time.utils';
import { ConflictoAlumnoDto } from '../dto/conflicto-alumno.dto';

export abstract class ExamenConflictValidator {
  abstract verificarConflictoProfesor(
    examenId: number,
    profesorId: number,
    fecha: string,
    hora: string,
    duracion: number,
  ): Promise<{ tieneConflicto: boolean; descripcion?: string }>;
  abstract calcularTodosConflictosAlumnos(examenesProf: Examen[]): Promise<ConflictoAlumnoDto[]>;
}


@Injectable()
export class SimpleExamenConflictValidator extends ExamenConflictValidator {
  constructor(
    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
  ) {
    super();
  }

  async verificarConflictoProfesor(

    examenId: number,
    profesorId: number,
    fecha: string,
    hora: string,
    duracion: number,
  ): Promise<{ tieneConflicto: boolean; descripcion?: string }> {
    const startMinutes = TimeUtils.convertTimeToMinutes(hora);
    const endMinutes = startMinutes + duracion;

    const examenesProf = await this.examenRepository.find({
      where: {
        profesorId,
        fecha,
        id: Not(examenId),
      },
    });

    const conflicto = this.detectarSolapamiento(examenesProf, startMinutes, endMinutes);
    if (conflicto) {
      const horaConflicto = conflicto.hora || '00:00';
      const exEnd = TimeUtils.convertTimeToMinutes(horaConflicto) + conflicto.duracion;
      return {
        tieneConflicto: true,
        descripcion: `El profesor ya supervisa el examen "${conflicto.codigo}" el ${conflicto.fecha} de ${horaConflicto} a ${TimeUtils.minutesToTime(exEnd)}.`,
      };
    }

    return { tieneConflicto: false };
  }

  async calcularTodosConflictosAlumnos(
    examenesProf: Examen[],
  ): Promise<ConflictoAlumnoDto[]> {
    const conflictos: ConflictoAlumnoDto[] = [];
    const conflictKeys = new Set<string>();

    for (const ex of examenesProf) {
      if (!ex.fecha || !ex.hora) continue;
      const startMinutes = TimeUtils.convertTimeToMinutes(ex.hora);
      const endMinutes = startMinutes + ex.duracion;

      const exGradoId = ex.gradoId;
      const exCuatrimestre = ex.cuatrimestre;
      if (exGradoId && exCuatrimestre !== undefined) {
        const candidatosGrado = await this.examenRepository.find({
          where: {
            fecha: ex.fecha,
            id: Not(ex.id),
            asignatura: {
              gradoId: exGradoId,
              cuatrimestre: exCuatrimestre,
            },
          },
          relations: {
            asignatura: {
              grado: true,
            },
          },
        });

        for (const cand of candidatosGrado) {
          if (!cand.hora) continue;
          const candStart = TimeUtils.convertTimeToMinutes(cand.hora);
          const candEnd = candStart + cand.duracion;

          if (TimeUtils.hasOverlap(startMinutes, endMinutes, candStart, candEnd)) {
            const key = `Alumnos-${ex.id < cand.id ? `${ex.id}-${cand.id}` : `${cand.id}-${ex.id}`}`;
            if (!conflictKeys.has(key)) {
              conflictKeys.add(key);
              conflictos.push({
                examenId: ex.id,
                examenCodigo: ex.codigo,
                asignaturaNombre: ex.nombreAsignatura,
                gradoNombre: `${ex.nombreGrado} (${exCuatrimestre}º Cuatr.)`,
                fecha: ex.fecha,
                hora: ex.hora,
                duracion: ex.duracion,
                solapaConExamenId: cand.id,
                solapaConExamenCodigo: cand.codigo,
                solapaConAsignaturaNombre: cand.nombreAsignatura,
                motivoConflicto: `Los alumnos de "${ex.nombreGrado}" (${exCuatrimestre}º Cuatr.) tienen exámenes simultáneos: ${ex.codigo} y ${cand.codigo}.`,
                tipoConflicto: 'Alumnos',
              });
            }
          }
        }
      }

      if (ex.aulaId) {
        const candidatosAula = await this.examenRepository.find({
          where: {
            fecha: ex.fecha,
            aulaId: ex.aulaId,
            id: Not(ex.id),
          },
          relations: {
            asignatura: true,
            aula: true,
          },
        });

        for (const cand of candidatosAula) {
          if (!cand.hora) continue;
          const candStart = TimeUtils.convertTimeToMinutes(cand.hora);
          const candEnd = candStart + cand.duracion;

          if (TimeUtils.hasOverlap(startMinutes, endMinutes, candStart, candEnd)) {
            const key = `Aula-${ex.id < cand.id ? `${ex.id}-${cand.id}` : `${cand.id}-${ex.id}`}`;
            if (!conflictKeys.has(key)) {
              conflictKeys.add(key);
              conflictos.push({
                examenId: ex.id,
                examenCodigo: ex.codigo,
                asignaturaNombre: ex.nombreAsignatura,
                gradoNombre: ex.nombreGrado,
                fecha: ex.fecha,
                hora: ex.hora,
                duracion: ex.duracion,
                solapaConExamenId: cand.id,
                solapaConExamenCodigo: cand.codigo,
                solapaConAsignaturaNombre: cand.nombreAsignatura,
                motivoConflicto: `Sobreposición de aula física: Ambos exámenes comparten el aula "${ex.nombreAula}" a la misma hora.`,
                tipoConflicto: 'Aula',
              });
            }
          }
        }
      }

      if (ex.profesorId) {
        const candidatosProf = await this.examenRepository.find({
          where: {
            fecha: ex.fecha,
            profesorId: ex.profesorId,
            id: Not(ex.id),
          },
          relations: {
            asignatura: true,
            profesor: true,
          },
        });

        for (const cand of candidatosProf) {
          if (!cand.hora) continue;
          const candStart = TimeUtils.convertTimeToMinutes(cand.hora);
          const candEnd = candStart + cand.duracion;

          if (TimeUtils.hasOverlap(startMinutes, endMinutes, candStart, candEnd)) {
            const key = `Profesor-${ex.id < cand.id ? `${ex.id}-${cand.id}` : `${cand.id}-${ex.id}`}`;
            if (!conflictKeys.has(key)) {
              conflictKeys.add(key);
              conflictos.push({
                examenId: ex.id,
                examenCodigo: ex.codigo,
                asignaturaNombre: ex.nombreAsignatura,
                gradoNombre: ex.nombreGrado,
                fecha: ex.fecha,
                hora: ex.hora,
                duracion: ex.duracion,
                solapaConExamenId: cand.id,
                solapaConExamenCodigo: cand.codigo,
                solapaConAsignaturaNombre: cand.nombreAsignatura,
                motivoConflicto: `Doble asignación de docente: El profesor "${ex.nombreProfesor}" supervisa ambos exámenes simultáneamente.`,
                tipoConflicto: 'Profesor',
              });
            }
          }
        }
      }
    }

    return conflictos;
  }

  private detectarSolapamiento(examenes: Examen[], start: number, end: number): Examen | null {
    for (const ex of examenes) {
      if (!ex.hora) continue;
      const exStart = TimeUtils.convertTimeToMinutes(ex.hora);
      const exEnd = exStart + ex.duracion;
      if (TimeUtils.hasOverlap(start, end, exStart, exEnd)) {
        return ex;
      }
    }
    return null;
  }
}
