import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grado } from '../../entities/grado.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearGradoDto } from './dto/crear-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';
import { ImportResultDto } from './dto/import-result.dto';
import { FileParserFactory } from '../../common/services/file-parser.factory';

@Injectable()
export class GradoService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
    private readonly fileParserFactory: FileParserFactory,
  ) {}

  async create(crearGradoDto: CrearGradoDto): Promise<Grado> {
    const { codigo } = crearGradoDto;

    const existente = await this.gradoRepository.findOneBy({ codigo });
    if (existente) {
      throw new ConflictException(`El grado con código ${codigo} ya existe`);
    }

    const nuevoGrado = this.gradoRepository.create(crearGradoDto);
    return this.gradoRepository.save(nuevoGrado);
  }

  async findOne(id: number): Promise<Grado> {
    const grado = await this.gradoRepository.findOneBy({ id });
    if (!grado) {
      throw new NotFoundException(`Grado con ID ${id} no encontrado`);
    }
    return grado;
  }

  async update(id: number, updateGradoDto: UpdateGradoDto): Promise<Grado> {
    const grado = await this.findOne(id);

    if (updateGradoDto.codigo && updateGradoDto.codigo !== grado.codigo) {
      const existente = await this.gradoRepository.findOneBy({ codigo: updateGradoDto.codigo });
      if (existente) {
        throw new ConflictException(`El código ${updateGradoDto.codigo} ya está en uso por otro grado`);
      }
    }

    const gradoActualizado = Object.assign(grado, updateGradoDto);
    return this.gradoRepository.save(gradoActualizado);
  }

  async countDependencies(id: number): Promise<number> {
    return 0;
  }

  async remove(id: number): Promise<void> {
    const grado = await this.findOne(id);
    await this.gradoRepository.remove(grado);
  }

  async removeBulk(ids: number[]): Promise<void> {
    await this.gradoRepository.delete(ids);
  }

  async importar(buffer: Buffer, mimetype: string): Promise<ImportResultDto> {
    const parser = this.fileParserFactory.getParser(mimetype);
    // Para CSV se asume que no hay cabecera (mapeo posicional)
    const rawData = parser.parse<any>(buffer, ['codigo', 'nombre', 'descripcion']);
    
    let exitos = 0;
    let fallos = 0;
    const detalles: string[] = [];
    const gradosParaGuardar: Grado[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const { codigo, nombre, descripcion } = row;

      if (!codigo || !nombre) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El código y el nombre son obligatorios.`);
        continue;
      }

      const existente = await this.gradoRepository.findOneBy({ codigo });
      if (existente) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El código "${codigo}" ya existe.`);
      } else {
        gradosParaGuardar.push(this.gradoRepository.create({ codigo, nombre, descripcion }));
        exitos++;
      }
    }

    if (gradosParaGuardar.length > 0) {
      await this.gradoRepository.save(gradosParaGuardar);
    }

    return new ImportResultDto(exitos, fallos, detalles);
  }

  async findAll(page: number = 1): Promise<PagedResultDto<Grado>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const [data, total] = await this.gradoRepository.findAndCount({
      skip,
      take: this.PAGE_SIZE,
      order: { nombre: 'ASC' },
    });

    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }

  async findByCriterio(criterio: string, page: number = 1): Promise<PagedResultDto<Grado>> {
    const skip = (page - 1) * this.PAGE_SIZE;
    const queryBuilder = this.gradoRepository.createQueryBuilder('grado');
    
    queryBuilder
      .where('grado.nombre LIKE :criterio', { criterio: '%' + criterio + '%' })
      .orWhere('grado.codigo LIKE :criterio', { criterio: '%' + criterio + '%' })
      .orderBy('grado.nombre', 'ASC')
      .skip(skip)
      .take(this.PAGE_SIZE);

    const [data, total] = await queryBuilder.getManyAndCount();
    return new PagedResultDto(data, total, page, this.PAGE_SIZE);
  }
}
