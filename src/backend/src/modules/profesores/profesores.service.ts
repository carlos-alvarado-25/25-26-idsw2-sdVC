import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profesor } from '../../entities/profesor.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Examen } from '../../entities/examen.entity';
import { Usuario, UserRole } from '../../entities/usuario.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearProfesorDto } from './dto/crear-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { ImportResultDto } from '../../common/dto/import-result.dto';
import { FileParserFactory } from '../../common/services/file-parser.factory';
import { Preferencia } from '../../entities/preferencia.entity';
import { CrearPreferenciaDto } from './dto/crear-preferencia.dto';
import { TimeUtils } from '../../common/utils/time.utils';
import { UsersService } from '../auth/users.service';


@Injectable()
export class ProfesorService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Asignatura)
    private readonly asignaturaRepository: Repository<Asignatura>,
    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
    @InjectRepository(Preferencia)
    private readonly preferenciaRepository: Repository<Preferencia>,
    private readonly fileParserFactory: FileParserFactory,
    private readonly usersService: UsersService,
  ) {}

  async findAll(page: number = 1): Promise<PagedResultDto<Profesor>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const [data, total] = await this.profesorRepository.findAndCount({
      relations: { asignaturas: true },
      skip,
      take: this.PAGE_SIZE,
      order: { nombre: 'ASC' },
    });

    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findByCriterio(criterio: string, page: number = 1): Promise<PagedResultDto<Profesor>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const queryBuilder = this.profesorRepository.createQueryBuilder('profesor');

    queryBuilder
      .leftJoinAndSelect('profesor.asignaturas', 'asignatura')
      .where('profesor.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('profesor.codigo LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('profesor.departamento LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('asignatura.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orderBy('profesor.nombre', 'ASC')
      .skip(skip)
      .take(this.PAGE_SIZE);

    const [data, total] = await queryBuilder.getManyAndCount();
    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findOne(id: number): Promise<Profesor> {
    const profesor = await this.profesorRepository.findOne({
      where: { id },
      relations: { asignaturas: true },
    });
    if (!profesor) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return profesor;
  }

  async create(dto: CrearProfesorDto): Promise<Profesor> {
    const { codigo, email, asignaturasIds } = dto;

    const existCod = await this.profesorRepository.findOneBy({ codigo });
    if (existCod) {
      throw new ConflictException(`El profesor con código ${codigo} ya existe`);
    }

    const existEmail = await this.profesorRepository.findOneBy({ email });
    if (existEmail) {
      throw new ConflictException(`El email ${email} ya está registrado`);
    }

    return this.profesorRepository.manager.transaction(async (transactionalEntityManager) => {
      const usuario = await this.usersService.getOrCreateAssociatedUser(
        email,
        UserRole.PROFESOR,
        transactionalEntityManager,
      );

      const nuevo = this.profesorRepository.create({
        codigo,
        nombre: dto.nombre,
        email,
        departamento: dto.departamento,
        usuarioId: usuario.id,
        asignaturas: [],
      });

      if (asignaturasIds && asignaturasIds.length > 0) {
        const asignaturas = await this.asignaturaRepository.findBy({ id: In(asignaturasIds) });
        nuevo.asignaturas = asignaturas;
      }

      return transactionalEntityManager.save(Profesor, nuevo);
    });
  }

  async update(id: number, dto: UpdateProfesorDto): Promise<Profesor> {
    const profesor = await this.findOne(id);

    if (dto.codigo && dto.codigo !== profesor.codigo) {
      const existCod = await this.profesorRepository.findOneBy({ codigo: dto.codigo });
      if (existCod) {
        throw new ConflictException(`El código ${dto.codigo} ya está en uso`);
      }
    }

    if (dto.email && dto.email !== profesor.email) {
      const existEmail = await this.profesorRepository.findOneBy({ email: dto.email });
      if (existEmail) {
        throw new ConflictException(`El email ${dto.email} ya está en uso`);
      }
    }

    return this.profesorRepository.manager.transaction(async (em) => {
      if (dto.email && dto.email !== profesor.email) {
        if (profesor.usuarioId) {
          await this.usersService.updateEmail(profesor.usuarioId, dto.email, em);
        }
      }

      if (dto.nombre) profesor.nombre = dto.nombre;
      if (dto.codigo) profesor.codigo = dto.codigo;
      if (dto.email) profesor.email = dto.email;
      if (dto.departamento) profesor.departamento = dto.departamento;

      if (dto.asignaturasIds !== undefined) {
        if (dto.asignaturasIds.length > 0) {
          const asignaturas = await em.findBy(Asignatura, { id: In(dto.asignaturasIds) });
          profesor.asignaturas = asignaturas;
        } else {
          profesor.asignaturas = [];
        }
      }

      return em.save(Profesor, profesor);
    });
  }

  async removeBulk(ids: number[]): Promise<void> {
    await this.profesorRepository.manager.transaction(async (em) => {
      const profesores = await em.find(Profesor, {
        where: { id: In(ids) },
      });
      const usuarioIds = profesores
        .map((p) => p.usuarioId)
        .filter((uid): uid is number => uid !== null);

      await em.delete(Profesor, ids);

      if (usuarioIds.length > 0) {
        await this.usersService.deleteUsers(usuarioIds, em);
      }
    });
  }

  async getImpacto(id: number): Promise<{ examenesCount: number }> {
    const examenesCount = await this.examenRepository.countBy({ profesorId: id });
    return { examenesCount };
  }

  async importar(buffer: Buffer, mimetype: string): Promise<ImportResultDto> {
    const parser = this.fileParserFactory.getParser(mimetype);
    const rawData = parser.parse<any>(buffer, ['codigo', 'nombre', 'email', 'departamento']);

    let exitos = 0;
    let fallos = 0;
    const detalles: string[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const { codigo, nombre, email, departamento } = row;

      if (!codigo || !nombre || !email || !departamento) {
        fallos++;
        detalles.push(`Fila ${i + 2}: Datos inválidos o incompletos.`);
        continue;
      }

      const existCod = await this.profesorRepository.findOneBy({ codigo });
      if (existCod) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El código de profesor "${codigo}" ya está registrado.`);
        continue;
      }

      const existEmail = await this.profesorRepository.findOneBy({ email });
      if (existEmail) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El email "${email}" ya está registrado.`);
        continue;
      }

      try {
        await this.profesorRepository.manager.transaction(async (em) => {
          const usuario = await this.usersService.getOrCreateAssociatedUser(
            email,
            UserRole.PROFESOR,
            em,
          );

          const profesor = em.create(Profesor, {
            codigo,
            nombre,
            email,
            departamento,
            usuarioId: usuario.id,
            asignaturas: [],
          });
          await em.save(Profesor, profesor);
        });
        exitos++;
      } catch (err: any) {
        fallos++;
        const msg = err?.sqlMessage ?? err?.message ?? 'Error desconocido';
        detalles.push(`Fila ${i + 2}: ${msg}`);
      }
    }

    return new ImportResultDto(exitos, fallos, detalles);
  }

  async findPreferencias(profesorId: number): Promise<Preferencia[]> {
    await this.findOne(profesorId);
    return this.preferenciaRepository.find({
      where: { profesorId },
      order: { diaSemana: 'ASC', horaInicio: 'ASC' },
    });
  }

  async createPreferencia(profesorId: number, dto: CrearPreferenciaDto): Promise<Preferencia> {
    await this.findOne(profesorId);
    
    if (dto.horaInicio >= dto.horaFin) {
      throw new ConflictException('La hora de inicio debe ser menor que la hora de fin');
    }

    const existing = await this.preferenciaRepository.find({
      where: { profesorId, diaSemana: dto.diaSemana }
    });

    const hasOverlap = existing.some(p => {
      return TimeUtils.hasOverlap(
        TimeUtils.convertTimeToMinutes(dto.horaInicio),
        TimeUtils.convertTimeToMinutes(dto.horaFin),
        TimeUtils.convertTimeToMinutes(p.horaInicio),
        TimeUtils.convertTimeToMinutes(p.horaFin),
      );
    });

    if (hasOverlap) {
      throw new ConflictException('Ya existe una restricción horaria que se solapa con este rango');
    }

    const nueva = this.preferenciaRepository.create({
      profesorId,
      diaSemana: dto.diaSemana,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      disponible: dto.disponible,
    });

    return this.preferenciaRepository.save(nueva);
  }

  async removePreferencia(id: number): Promise<void> {
    const pref = await this.preferenciaRepository.findOneBy({ id });
    if (!pref) {
      throw new NotFoundException(`Preferencia con ID ${id} no encontrada`);
    }
    await this.preferenciaRepository.remove(pref);
  }
}
