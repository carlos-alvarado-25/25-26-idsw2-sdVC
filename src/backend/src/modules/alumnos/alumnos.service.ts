import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Alumno } from '../../entities/alumno.entity';
import { Grado } from '../../entities/grado.entity';
import { Usuario, UserRole } from '../../entities/usuario.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearAlumnoDto } from './dto/crear-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { ImportResultDto } from '../../common/dto/import-result.dto';
import { FileParserFactory } from '../../common/services/file-parser.factory';
import { UsersService } from '../auth/users.service';

@Injectable()
export class AlumnoService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly fileParserFactory: FileParserFactory,
    private readonly usersService: UsersService,
  ) {}

  private async resolveUniqueEmail(baseEmail: string): Promise<{ emailAlumno: string; emailUsuario: string }> {
    const usuarioExistente = await this.usuarioRepository.findOneBy({ email: baseEmail });
    if (!usuarioExistente) {
      return { emailAlumno: baseEmail, emailUsuario: baseEmail };
    }

    const alumnoVinculado = await this.alumnoRepository.findOneBy({ usuarioId: usuarioExistente.id });
    if (!alumnoVinculado) {
      return { emailAlumno: baseEmail, emailUsuario: baseEmail };
    }

    const atIdx = baseEmail.indexOf('@');
    const local = baseEmail.substring(0, atIdx);
    const domain = baseEmail.substring(atIdx);

    let counter = 2;
    while (counter < 1000) {
      const candidate = `${local}${counter}${domain}`;
      const taken = await this.usuarioRepository.findOneBy({ email: candidate });
      if (!taken) {
        return { emailAlumno: candidate, emailUsuario: candidate };
      }
      counter++;
    }

    throw new Error(`No se pudo generar un email único para ${baseEmail}`);
  }

  async importar(buffer: Buffer, mimetype: string): Promise<ImportResultDto> {
    const parser = this.fileParserFactory.getParser(mimetype);
    const rawData = parser.parse<any>(buffer, ['matricula', 'nombre', 'email', 'curso', 'grado_codigo']);
    
    let exitos = 0;
    let fallos = 0;
    const detalles: string[] = [];

    const todosLosGrados = await this.gradoRepository.find();
    const gradosMap = new Map(todosLosGrados.map(g => [g.codigo.toUpperCase(), g]));

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const { matricula, nombre, email, curso, grado_codigo } = row;
      const cursoNum = parseInt(curso, 10);

      if (!matricula || !nombre || !email || isNaN(cursoNum) || !grado_codigo) {
        fallos++;
        detalles.push(`Fila ${i + 2}: Datos inválidos o incompletos.`);
        continue;
      }

      const existente = await this.alumnoRepository.findOneBy({ matricula });
      if (existente) {
        fallos++;
        detalles.push(`Fila ${i + 2}: La matrícula "${matricula}" ya está registrada.`);
        continue;
      }

      const grado = gradosMap.get(grado_codigo.toUpperCase());
      if (!grado) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El grado con código "${grado_codigo}" no existe.`);
        continue;
      }

      try {
        const { emailAlumno, emailUsuario } = await this.resolveUniqueEmail(email);
        const emailAjustado = emailAlumno !== email;

        await this.alumnoRepository.manager.transaction(async (em) => {
          const usuario = await this.usersService.getOrCreateAssociatedUser(
            emailUsuario,
            UserRole.ALUMNO,
            em,
          );

          const alumno = em.create(Alumno, {
            matricula,
            nombre,
            email: emailAlumno,
            curso: cursoNum,
            gradoId: grado.id,
            usuarioId: usuario.id,
          });
          await em.save(Alumno, alumno);
        });

        exitos++;
        if (emailAjustado) {
          detalles.push(`Fila ${i + 2}: Email duplicado en CSV — asignado "${emailAlumno}" para "${nombre}".`);
        }
      } catch (err: any) {
        fallos++;
        const msg = err?.sqlMessage ?? err?.message ?? 'Error desconocido';
        detalles.push(`Fila ${i + 2}: ${msg}`);
      }
    }

    return new ImportResultDto(exitos, fallos, detalles);

  }

  async create(dto: CrearAlumnoDto): Promise<Alumno> {
    const { matricula, gradoId, email } = dto;

    const existente = await this.alumnoRepository.findOneBy({ matricula });
    if (existente) {
      throw new ConflictException(`El alumno con matrícula ${matricula} ya existe`);
    }

    const grado = await this.gradoRepository.findOneBy({ id: gradoId });
    if (!grado) {
      throw new NotFoundException(`Grado con ID ${gradoId} no encontrado`);
    }

    return this.alumnoRepository.manager.transaction(async (transactionalEntityManager) => {
      const usuario = await this.usersService.getOrCreateAssociatedUser(
        email,
        UserRole.ALUMNO,
        transactionalEntityManager,
      );

      const nuevo = transactionalEntityManager.create(Alumno, {
        ...dto,
        usuarioId: usuario.id,
      });
      return transactionalEntityManager.save(Alumno, nuevo);
    });
  }

  async update(id: number, dto: UpdateAlumnoDto): Promise<Alumno> {
    const alumno = await this.findOne(id);

    if (dto.matricula && dto.matricula !== alumno.matricula) {
      const existente = await this.alumnoRepository.findOneBy({ matricula: dto.matricula });
      if (existente) {
        throw new ConflictException(`La matrícula ${dto.matricula} ya está en uso por otro alumno`);
      }
    }

    if (dto.gradoId) {
      const grado = await this.gradoRepository.findOneBy({ id: dto.gradoId });
      if (!grado) {
        throw new NotFoundException(`Grado con ID ${dto.gradoId} no encontrado`);
      }
      alumno.grado = grado;
    }

    return this.alumnoRepository.manager.transaction(async (em) => {
      if (dto.email && dto.email !== alumno.email) {
        if (alumno.usuarioId) {
          await this.usersService.updateEmail(alumno.usuarioId, dto.email, em);
        }
      }

      Object.assign(alumno, dto);
      return em.save(Alumno, alumno);
    });
  }

  async findAll(page: number = 1): Promise<PagedResultDto<Alumno>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const [data, total] = await this.alumnoRepository.findAndCount({
      relations: { grado: true },
      skip,
      take: this.PAGE_SIZE,
      order: { nombre: 'ASC' },
    });

    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findOne(id: number): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findOne({
      where: { id },
      relations: { grado: true },
    });
    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }
    return alumno;
  }

  async findByCriterio(criterio: string, page: number = 1): Promise<PagedResultDto<Alumno>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const queryBuilder = this.alumnoRepository.createQueryBuilder('alumno');
    
    queryBuilder
      .leftJoinAndSelect('alumno.grado', 'grado')
      .where('alumno.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('alumno.matricula LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('alumno.email LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('grado.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orderBy('alumno.nombre', 'ASC')
      .skip(skip)
      .take(this.PAGE_SIZE);

    const [data, total] = await queryBuilder.getManyAndCount();
    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async removeBulk(ids: number[]): Promise<void> {
    await this.alumnoRepository.manager.transaction(async (em) => {
      const alumnos = await em.find(Alumno, {
        where: { id: In(ids) },
      });
      const usuarioIds = alumnos
        .map((a) => a.usuarioId)
        .filter((uid): uid is number => uid !== null);

      await em.delete(Alumno, ids);
      if (usuarioIds.length > 0) {
        await this.usersService.deleteUsers(usuarioIds, em);
      }
    });
  }
}
