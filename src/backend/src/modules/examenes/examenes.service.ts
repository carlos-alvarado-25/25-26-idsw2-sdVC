import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Examen } from '../../entities/examen.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Alumno } from '../../entities/alumno.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';

import { CrearExamenDto } from './dto/crear-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';
import { ConflictoAlumnoDto } from './dto/conflicto-alumno.dto';
import { ExamenConflictValidator } from './services/examenes-conflict.validator';


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
    private readonly examenConflictValidator: ExamenConflictValidator,
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

    return this.examenConflictValidator.calcularTodosConflictosAlumnos(examenesProf);
  }

  async verificarConflictoProfesor(
    examenId: number,
    profesorId: number,
  ): Promise<{ tieneConflicto: boolean; descripcion?: string }> {
    const examen = await this.findOne(examenId);
    if (!examen.fecha || !examen.hora) {
      return { tieneConflicto: false };
    }

    return this.examenConflictValidator.verificarConflictoProfesor(
      examenId,
      profesorId,
      examen.fecha,
      examen.hora,
      examen.duracion,
    );
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

  async obtenerTotalConflictosProfesores(): Promise<{ total: number }> {
    const profesores = await this.profesorRepository.find();
    let total = 0;
    for (const prof of profesores) {
      const conflictos = await this.findConflictosAlumnos(prof.id);
      total += conflictos.length;
    }
    return { total };
  }
}

