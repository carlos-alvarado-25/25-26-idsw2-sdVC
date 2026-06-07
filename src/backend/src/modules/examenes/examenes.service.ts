import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Examen } from '../../entities/examen.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearExamenDto } from './dto/crear-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

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
        asignatura: true,
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

        if (examen.fecha && examen.hora) {
          const startMinutes = this.convertTimeToMinutes(examen.hora);
          const endMinutes = startMinutes + examen.duracion;

          const examenesAula = await this.examenRepository.find({
            where: {
              aulaId: dto.aulaId,
              fecha: examen.fecha,
              id: Not(id),
            },
          });

          const conflicto = this.detectarSolapamiento(examenesAula, startMinutes, endMinutes);
          if (conflicto) {
            throw new ConflictException(`El aula "${aula.codigo}" ya está ocupada en esta franja horaria por el examen "${conflicto.codigo}"`);
          }
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

        if (examen.fecha && examen.hora) {
          const startMinutes = this.convertTimeToMinutes(examen.hora);
          const endMinutes = startMinutes + examen.duracion;

          const examenesProf = await this.examenRepository.find({
            where: {
              profesorId: dto.profesorId,
              fecha: examen.fecha,
              id: Not(id),
            },
          });

          const conflicto = this.detectarSolapamiento(examenesProf, startMinutes, endMinutes);
          if (conflicto) {
            throw new ConflictException(`El profesor "${profesor.nombre}" ya supervisa otro examen en esta franja horaria ("${conflicto.codigo}")`);
          }
        }

        examen.profesorId = dto.profesorId;
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
}
