import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Examen } from '../../entities/examen.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Alumno } from '../../entities/alumno.entity';
import { Preferencia } from '../../entities/preferencia.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';

import { CrearExamenDto } from './dto/crear-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';
import { ConflictoAlumnoDto } from './dto/conflicto-alumno.dto';


@Injectable()
export class ExamenService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
    @InjectRepository(Asignatura)
    private readonly asignaturaRepository: Repository<Asignatura>,
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
  ) {}

  async findAll(page: number = 1): Promise<PagedResultDto<Examen>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const [data, total] = await this.examenRepository.findAndCount({
      relations: {
        asignatura: true,
        aula: true,
        profesor: true,
      },
      skip,
      take: this.PAGE_SIZE,
      order: { fecha: 'ASC', hora: 'ASC' },
    });

    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findByCriterio(criterio: string, page: number = 1): Promise<PagedResultDto<Examen>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const queryBuilder = this.examenRepository.createQueryBuilder('examen');

    queryBuilder
      .leftJoinAndSelect('examen.asignatura', 'asignatura')
      .leftJoinAndSelect('examen.aula', 'aula')
      .leftJoinAndSelect('examen.profesor', 'profesor')
      .where('examen.codigo LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('asignatura.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('asignatura.codigo LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('aula.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('aula.codigo LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('profesor.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orderBy('examen.fecha', 'ASC')
      .addOrderBy('examen.hora', 'ASC')
      .skip(skip)
      .take(this.PAGE_SIZE);

    const [data, total] = await queryBuilder.getManyAndCount();
    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findOne(id: number): Promise<Examen> {
    const examen = await this.examenRepository.findOne({
      where: { id },
      relations: {
        asignatura: {
          grado: true,
        },
        aula: true,
        profesor: true,
      },
    });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }
    return examen;
  }

  async create(dto: CrearExamenDto): Promise<Examen> {
    const { codigo, asignaturaId } = dto;

    const existCod = await this.examenRepository.findOneBy({ codigo });
    if (existCod) {
      throw new ConflictException(`El código de examen "${codigo}" ya está registrado`);
    }

    const asignatura = await this.asignaturaRepository.findOneBy({ id: asignaturaId });
    if (!asignatura) {
      throw new NotFoundException(`La asignatura con ID ${asignaturaId} no existe`);
    }

    const nuevo = this.examenRepository.create({
      codigo,
      fecha: dto.fecha,
      hora: dto.hora,
      duracion: dto.duracion,
      tipo: dto.tipo,
      asignaturaId,
    });

    return this.examenRepository.save(nuevo);
  }

  async update(id: number, dto: UpdateExamenDto): Promise<Examen> {
    const examen = await this.findOne(id);

    if (dto.codigo && dto.codigo !== examen.codigo) {
      const existCod = await this.examenRepository.findOneBy({ codigo: dto.codigo });
      if (existCod) {
        throw new ConflictException(`El código de examen "${dto.codigo}" ya está registrado`);
      }
      examen.codigo = dto.codigo;
    }

    if (dto.asignaturaId && dto.asignaturaId !== examen.asignaturaId) {
      const asignatura = await this.asignaturaRepository.findOneBy({ id: dto.asignaturaId });
      if (!asignatura) {
        throw new NotFoundException(`La asignatura con ID ${dto.asignaturaId} no existe`);
      }

      examen.asignaturaId = dto.asignaturaId;
    }

    if (dto.fecha) examen.fecha = dto.fecha;
    if (dto.hora) examen.hora = dto.hora;
    if (dto.duracion !== undefined) examen.duracion = dto.duracion;
    if (dto.tipo) examen.tipo = dto.tipo;

    if (dto.aulaId !== undefined) {
      if (dto.aulaId === null) {
        examen.aulaId = null;
        examen.aula = null;
      } else {
        const aula = await this.aulaRepository.findOneBy({ id: dto.aulaId });
        if (!aula) {
          throw new NotFoundException(`El aula con ID ${dto.aulaId} no existe`);
        }
        examen.aulaId = dto.aulaId;
        examen.aula = aula;
      }
    }

    if (dto.profesorId !== undefined) {
      if (dto.profesorId === null) {
        examen.profesorId = null;
        examen.profesor = null;
      } else {
        const profesor = await this.profesorRepository.findOneBy({ id: dto.profesorId });
        if (!profesor) {
          throw new NotFoundException(`El profesor con ID ${dto.profesorId} no existe`);
        }
        examen.profesorId = dto.profesorId;
        examen.profesor = profesor;
      }
    }

    // --- SECCIÓN DE VALIDACIONES UNIFICADAS ---
    if (examen.fecha && examen.hora) {
      const startMinutes = this.convertTimeToMinutes(examen.hora);
      const endMinutes = startMinutes + examen.duracion;

      // 1. Validar sobreposición de aula
      if (examen.aulaId) {
        const examenesAula = await this.examenRepository.find({
          where: {
            aulaId: examen.aulaId,
            fecha: examen.fecha,
            id: Not(id),
          },
        });

        const conflicto = this.detectarSolapamiento(examenesAula, startMinutes, endMinutes);
        if (conflicto) {
          throw new ConflictException(`El aula "${examen.nombreAula}" ya está ocupada en esta franja horaria por el examen "${conflicto.codigo}"`);
        }
      }

      // 2. Validar sobreposición de profesor
      if (examen.profesorId) {
        const examenesProf = await this.examenRepository.find({
          where: {
            profesorId: examen.profesorId,
            fecha: examen.fecha,
            id: Not(id),
          },
        });

        const conflicto = this.detectarSolapamiento(examenesProf, startMinutes, endMinutes);
        if (conflicto) {
          const prof = await this.profesorRepository.findOneBy({ id: examen.profesorId });
          throw new ConflictException(`El profesor "${prof?.nombre || 'seleccionado'}" ya supervisa otro examen en esta franja horaria ("${conflicto.codigo}")`);
        }

        // 3. Validar preferencias / exclusiones del profesor
        const profesor = await this.profesorRepository.findOne({
          where: { id: examen.profesorId },
          relations: { preferencias: true },
        });

        if (profesor) {
          const finHoraStr = this.minutesToTime(endMinutes);
          const franja = `${examen.hora}-${finHoraStr}`;
          
          if (!profesor.estaDisponibleEn(examen.fecha, franja, profesor.preferencias)) {
            const diaSemana = Preferencia.getDiaSemanaDeFecha(examen.fecha);
            const nombreDia = Preferencia.getNombreDia(diaSemana);
            throw new ConflictException(
              `El profesor "${profesor.nombre}" no está disponible en esta franja horaria por una restricción de preferencia registrada (${nombreDia} de ${examen.hora} a ${finHoraStr}).`
            );
          }
        }
      }
    }

    return this.examenRepository.save(examen);
  }

  async remove(id: number): Promise<void> {
    const examen = await this.findOne(id);
    await this.examenRepository.remove(examen);
  }

  async findSinProfesor(criterio: string = '', page: number = 1): Promise<PagedResultDto<Examen>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const queryBuilder = this.examenRepository.createQueryBuilder('examen');

    queryBuilder
      .leftJoinAndSelect('examen.asignatura', 'asignatura')
      .leftJoinAndSelect('examen.aula', 'aula')
      .where('examen.profesorId IS NULL');

    if (criterio) {
      queryBuilder.andWhere(
        '(examen.codigo LIKE :q OR asignatura.nombre LIKE :q OR asignatura.codigo LIKE :q)',
        { q: `%${criterio}%` },
      );
    }

    queryBuilder
      .orderBy('examen.fecha', 'ASC')
      .addOrderBy('examen.hora', 'ASC')
      .skip(skip)
      .take(this.PAGE_SIZE);

    const [data, total] = await queryBuilder.getManyAndCount();
    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findConflictosAlumnos(profesorId: number): Promise<ConflictoAlumnoDto[]> {
    const examenesProf = await this.examenRepository.find({
      where: {
        profesorId,
        fecha: Not(IsNull()),
      },
      relations: {
        asignatura: {
          grado: true,
        },
        aula: true,
        profesor: true,
      },
    });

    const conflictos: ConflictoAlumnoDto[] = [];
    const conflictKeys = new Set<string>();

    for (const ex of examenesProf) {
      if (!ex.fecha || !ex.hora) continue;
      const startMinutes = this.convertTimeToMinutes(ex.hora);
      const endMinutes = startMinutes + ex.duracion;

      // 1. Solapamiento de Alumnos (mismo Grado y mismo Cuatrimestre)
      const exGradoId = ex.asignatura?.gradoId;
      const exCuatrimestre = ex.asignatura?.cuatrimestre;
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
          const candStart = this.convertTimeToMinutes(cand.hora);
          const candEnd = candStart + cand.duracion;

          if (startMinutes < candEnd && candStart < endMinutes) {
            const key = `Alumnos-${ex.id < cand.id ? `${ex.id}-${cand.id}` : `${cand.id}-${ex.id}`}`;
            if (!conflictKeys.has(key)) {
              conflictKeys.add(key);
              conflictos.push({
                examenId: ex.id,
                examenCodigo: ex.codigo,
                asignaturaNombre: ex.nombreAsignatura,
                gradoNombre: `${ex.asignatura?.nombreGrado || 'Desconocido'} (${exCuatrimestre}º Cuatr.)`,
                fecha: ex.fecha,
                hora: ex.hora,
                duracion: ex.duracion,
                solapaConExamenId: cand.id,
                solapaConExamenCodigo: cand.codigo,
                solapaConAsignaturaNombre: cand.nombreAsignatura,
                motivoConflicto: `Los alumnos de "${ex.asignatura?.nombreGrado}" (${exCuatrimestre}º Cuatr.) tienen exámenes simultáneos: ${ex.codigo} y ${cand.codigo}.`,
                tipoConflicto: 'Alumnos',
              });
            }
          }
        }
      }

      // 2. Sobreposición de Aula
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
          const candStart = this.convertTimeToMinutes(cand.hora);
          const candEnd = candStart + cand.duracion;

          if (startMinutes < candEnd && candStart < endMinutes) {
            const key = `Aula-${ex.id < cand.id ? `${ex.id}-${cand.id}` : `${cand.id}-${ex.id}`}`;
            if (!conflictKeys.has(key)) {
              conflictKeys.add(key);
              conflictos.push({
                examenId: ex.id,
                examenCodigo: ex.codigo,
                asignaturaNombre: ex.nombreAsignatura,
                gradoNombre: ex.asignatura?.nombreGrado || 'Desconocido',
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

      // 3. Sobrecarga de Profesor
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
          const candStart = this.convertTimeToMinutes(cand.hora);
          const candEnd = candStart + cand.duracion;

          if (startMinutes < candEnd && candStart < endMinutes) {
            const key = `Profesor-${ex.id < cand.id ? `${ex.id}-${cand.id}` : `${cand.id}-${ex.id}`}`;
            if (!conflictKeys.has(key)) {
              conflictKeys.add(key);
              conflictos.push({
                examenId: ex.id,
                examenCodigo: ex.codigo,
                asignaturaNombre: ex.nombreAsignatura,
                gradoNombre: ex.asignatura?.nombreGrado || 'Desconocido',
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

  async verificarConflictoProfesor(
    examenId: number,
    profesorId: number,
  ): Promise<{ tieneConflicto: boolean; descripcion?: string }> {
    const examen = await this.findOne(examenId);
    if (!examen.fecha || !examen.hora) {
      return { tieneConflicto: false };
    }

    const startMinutes = this.convertTimeToMinutes(examen.hora);
    const endMinutes = startMinutes + examen.duracion;

    const examenesProf = await this.examenRepository.find({
      where: {
        profesorId,
        fecha: examen.fecha,
        id: Not(examenId),
      },
    });

    const conflicto = this.detectarSolapamiento(examenesProf, startMinutes, endMinutes);
    if (conflicto) {
      const horaConflicto = conflicto.hora || '00:00';
      const exEnd = this.convertTimeToMinutes(horaConflicto) + conflicto.duracion;
      return {
        tieneConflicto: true,
        descripcion: `El profesor ya supervisa el examen "${conflicto.codigo}" el ${conflicto.fecha} de ${horaConflicto} a ${this.minutesToTime(exEnd)}.`,
      };
    }

    return { tieneConflicto: false };
  }

  /**
   * Detecta si un rango horario se solapa con una lista de exámenes
   */
  private detectarSolapamiento(examenes: Examen[], start: number, end: number): Examen | null {
    for (const ex of examenes) {
      if (!ex.hora) continue;
      const exStart = this.convertTimeToMinutes(ex.hora);
      const exEnd = exStart + ex.duracion;
      if (start < exEnd && exStart < end) {
        return ex;
      }
    }
    return null;
  }

  private convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  async findCalendario(params: {
    fechaInicio?: string;
    fechaFin?: string;
    gradoId?: number;
    asignaturaId?: number;
    rol?: string;
    email?: string;
    usuarioId?: number;
  }): Promise<Examen[]> {
    const { fechaInicio, fechaFin, gradoId, asignaturaId, rol, email, usuarioId } = params;

    const queryBuilder = this.examenRepository.createQueryBuilder('examen')
      .leftJoinAndSelect('examen.asignatura', 'asignatura')
      .leftJoinAndSelect('asignatura.grado', 'grado')
      .leftJoinAndSelect('examen.aula', 'aula')
      .leftJoinAndSelect('examen.profesor', 'profesor')
      .where('examen.fecha IS NOT NULL');

    if (fechaInicio) {
      queryBuilder.andWhere('examen.fecha >= :fechaInicio', { fechaInicio });
    }
    if (fechaFin) {
      queryBuilder.andWhere('examen.fecha <= :fechaFin', { fechaFin });
    }

    // Cargar contexto del actor una sola vez
    let forcedGradoId: number | undefined = undefined;

    if (rol === 'Profesor' && (usuarioId || email)) {
      const profesor = usuarioId 
        ? await this.profesorRepository.findOneBy({ usuarioId })
        : await this.profesorRepository.findOneBy({ email });
      if (!profesor) return [];
      queryBuilder.andWhere('examen.profesorId = :profesorId', { profesorId: profesor.id });
    } else if (rol === 'Alumno' && (usuarioId || email)) {
      const alumno = usuarioId
        ? await this.alumnoRepository.findOneBy({ usuarioId })
        : await this.alumnoRepository.findOneBy({ email });
      if (!alumno) return [];
      forcedGradoId = alumno.gradoId;
      queryBuilder.andWhere('asignatura.gradoId = :alumnoGradoId', { alumnoGradoId: forcedGradoId });
    }

    // Aplicar filtros manuales (para Alumno se fuerza su gradoId original)
    const finalGradoId = forcedGradoId !== undefined ? forcedGradoId : gradoId;
    if (finalGradoId) {
      queryBuilder.andWhere('asignatura.gradoId = :finalGradoId', { finalGradoId });
    }

    if (asignaturaId) {
      queryBuilder.andWhere('examen.asignaturaId = :asignaturaId', { asignaturaId });
    }

    queryBuilder.orderBy('examen.fecha', 'ASC').addOrderBy('examen.hora', 'ASC');

    return queryBuilder.getMany();
  }
}
