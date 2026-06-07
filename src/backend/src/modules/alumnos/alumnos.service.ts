import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from '../../entities/alumno.entity';
import { Grado } from '../../entities/grado.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearAlumnoDto } from './dto/crear-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { ImportResultDto } from './dto/import-result.dto';
import { FileParserFactory } from '../../common/services/file-parser.factory';

@Injectable()
export class AlumnoService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
    private readonly fileParserFactory: FileParserFactory,
  ) {}

  async importar(buffer: Buffer, mimetype: string): Promise<ImportResultDto> {
    const parser = this.fileParserFactory.getParser(mimetype);
    const rawData = parser.parse<any>(buffer, ['matricula', 'nombre', 'email', 'curso', 'grado_codigo']);
    
    let exitos = 0;
    let fallos = 0;
    const detalles: string[] = [];
    const alumnosParaGuardar: Alumno[] = [];

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

      alumnosParaGuardar.push(this.alumnoRepository.create({
        matricula,
        nombre,
        email,
        curso: cursoNum,
        gradoId: grado.id
      }));
      exitos++;
    }

    if (alumnosParaGuardar.length > 0) {
      await this.alumnoRepository.save(alumnosParaGuardar);
    }

    return new ImportResultDto(exitos, fallos, detalles);
  }

  async create(dto: CrearAlumnoDto): Promise<Alumno> {
    const { matricula, gradoId } = dto;

    const existente = await this.alumnoRepository.findOneBy({ matricula });
    if (existente) {
      throw new ConflictException(`El alumno con matrícula ${matricula} ya existe`);
    }

    const grado = await this.gradoRepository.findOneBy({ id: gradoId });
    if (!grado) {
      throw new NotFoundException(`Grado con ID ${gradoId} no encontrado`);
    }

    const nuevo = this.alumnoRepository.create(dto);
    return this.alumnoRepository.save(nuevo);
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

    Object.assign(alumno, dto);
    return this.alumnoRepository.save(alumno);
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
    await this.alumnoRepository.delete(ids);
  }
}
