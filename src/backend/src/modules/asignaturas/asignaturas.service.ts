import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignatura } from '../../entities/asignatura.entity';
import { Grado } from '../../entities/grado.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearAsignaturaDto } from './dto/crear-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { ImportResultDto } from './dto/import-result.dto';
import { FileParserFactory } from '../../common/services/file-parser.factory';

@Injectable()
export class AsignaturaService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Asignatura)
    private readonly asignaturaRepository: Repository<Asignatura>,
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
    private readonly fileParserFactory: FileParserFactory,
    ) {}

    async importar(buffer: Buffer, mimetype: string): Promise<ImportResultDto> {
      const parser = this.fileParserFactory.getParser(mimetype);
      const rawData = parser.parse<any>(buffer, ['codigo', 'nombre', 'creditos', 'grado_codigo']);

      let exitos = 0;

    let fallos = 0;
    const detalles: string[] = [];
    const asignaturasParaGuardar: Asignatura[] = [];

    const todosLosGrados = await this.gradoRepository.find();
    const gradosMap = new Map(todosLosGrados.map(g => [g.codigo.toUpperCase(), g]));

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const { codigo, nombre, creditos, grado_codigo } = row;
      const creditosNum = parseInt(creditos, 10);

      if (!codigo || !nombre || isNaN(creditosNum) || !grado_codigo) {
        fallos++;
        detalles.push(`Fila ${i + 2}: Datos inválidos o incompletos.`);
        continue;
      }

      const existente = await this.asignaturaRepository.findOneBy({ codigo });
      if (existente) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El código de asignatura "${codigo}" ya existe.`);
        continue;
      }

      const grado = gradosMap.get(grado_codigo.toUpperCase());
      if (!grado) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El grado con código "${grado_codigo}" no existe.`);
        continue;
      }

      asignaturasParaGuardar.push(this.asignaturaRepository.create({
        codigo,
        nombre,
        creditos: creditosNum,
        gradoId: grado.id
      }));
      exitos++;
    }

    if (asignaturasParaGuardar.length > 0) {
      await this.asignaturaRepository.save(asignaturasParaGuardar);
    }

    return new ImportResultDto(exitos, fallos, detalles);
  }

  async create(dto: CrearAsignaturaDto): Promise<Asignatura> {
    const { codigo, gradoId } = dto;

    const existente = await this.asignaturaRepository.findOneBy({ codigo });
    if (existente) {
      throw new ConflictException(`La asignatura con código ${codigo} ya existe`);
    }

    const grado = await this.gradoRepository.findOneBy({ id: gradoId });
    if (!grado) {
      throw new NotFoundException(`Grado con ID ${gradoId} no encontrado`);
    }

    const nueva = this.asignaturaRepository.create(dto);
    return this.asignaturaRepository.save(nueva);
  }

  async update(id: number, dto: UpdateAsignaturaDto): Promise<Asignatura> {
    const asignatura = await this.findOne(id);

    if (dto.codigo && dto.codigo !== asignatura.codigo) {
      const existente = await this.asignaturaRepository.findOneBy({ codigo: dto.codigo });
      if (existente) {
        throw new ConflictException(`El código ${dto.codigo} ya está en uso`);
      }
    }

    if (dto.gradoId) {
      const grado = await this.gradoRepository.findOneBy({ id: dto.gradoId });
      if (!grado) throw new NotFoundException('Grado no encontrado');
    }

    const actualizada = Object.assign(asignatura, dto);
    return this.asignaturaRepository.save(actualizada);
  }

  async findAll(page: number = 1): Promise<PagedResultDto<Asignatura>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const [data, total] = await this.asignaturaRepository.findAndCount({
      relations: { grado: true },
      skip,
      take: this.PAGE_SIZE,
      order: { nombre: 'ASC' },
    });

    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findByCriterio(criterio: string, page: number = 1): Promise<PagedResultDto<Asignatura>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const queryBuilder = this.asignaturaRepository.createQueryBuilder('asignatura');
    
    queryBuilder
      .leftJoinAndSelect('asignatura.grado', 'grado')
      .where('asignatura.nombre LIKE :criterio', { criterio: '%' + criterio + '%' })
      .orWhere('asignatura.codigo LIKE :criterio', { criterio: '%' + criterio + '%' })
      .orWhere('grado.nombre LIKE :criterio', { criterio: '%' + criterio + '%' })
      .orderBy('asignatura.nombre', 'ASC')
      .skip(skip)
      .take(this.PAGE_SIZE);

    const [data, total] = await queryBuilder.getManyAndCount();
    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findOne(id: number): Promise<Asignatura> {
    const asignatura = await this.asignaturaRepository.findOne({
      where: { id },
      relations: { grado: true },
    });
    if (!asignatura) {
      throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);
    }
    return asignatura;
  }

  async getImpacto(id: number): Promise<{ examenesAsociados: number }> {
    // TODO: Inyectar ExamenRepository y realizar el conteo real cuando se implemente el ramillete de Exámenes.
    return { examenesAsociados: 0 };
  }

  async remove(id: number): Promise<void> {
    const asignatura = await this.findOne(id);
    await this.asignaturaRepository.remove(asignatura);
  }

  async removeBulk(ids: number[]): Promise<void> {
    await this.asignaturaRepository.delete(ids);
  }
}
