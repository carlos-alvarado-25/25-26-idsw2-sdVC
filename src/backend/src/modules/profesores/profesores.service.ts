import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profesor } from '../../entities/profesor.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Examen } from '../../entities/examen.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearProfesorDto } from './dto/crear-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { ImportResultDto } from './dto/import-result.dto';
import { FileParserFactory } from '../../common/services/file-parser.factory';

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
    private readonly fileParserFactory: FileParserFactory,
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

    const nuevo = this.profesorRepository.create({
      codigo,
      nombre: dto.nombre,
      email,
      departamento: dto.departamento,
      asignaturas: [],
    });

    if (asignaturasIds && asignaturasIds.length > 0) {
      const asignaturas = await this.asignaturaRepository.findBy({ id: In(asignaturasIds) });
      nuevo.asignaturas = asignaturas;
    }

    return this.profesorRepository.save(nuevo);
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

    if (dto.nombre) profesor.nombre = dto.nombre;
    if (dto.codigo) profesor.codigo = dto.codigo;
    if (dto.email) profesor.email = dto.email;
    if (dto.departamento) profesor.departamento = dto.departamento;

    if (dto.asignaturasIds !== undefined) {
      if (dto.asignaturasIds.length > 0) {
        const asignaturas = await this.asignaturaRepository.findBy({ id: In(dto.asignaturasIds) });
        profesor.asignaturas = asignaturas;
      } else {
        profesor.asignaturas = [];
      }
    }

    return this.profesorRepository.save(profesor);
  }

  async removeBulk(ids: number[]): Promise<void> {
    // TODO: Eliminar todas las restricciones de PreferenciaRepository vinculadas a los ids de profesores.
    await this.profesorRepository.delete(ids);
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
    const profesoresParaGuardar: Profesor[] = [];

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

      profesoresParaGuardar.push(this.profesorRepository.create({
        codigo,
        nombre,
        email,
        departamento,
        asignaturas: [],
      }));
      exitos++;
    }

    if (profesoresParaGuardar.length > 0) {
      await this.profesorRepository.save(profesoresParaGuardar);
    }

    return new ImportResultDto(exitos, fallos, detalles);
  }
}
