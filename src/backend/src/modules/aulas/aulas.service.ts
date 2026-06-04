import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula } from '../../entities/aula.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { ImportResultDto } from './dto/import-result.dto';
import { FileParserFactory } from '../../common/services/file-parser.factory';

@Injectable()
export class AulaService {
  constructor(
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    private readonly fileParserFactory: FileParserFactory,
  ) {}

  async importar(buffer: Buffer, mimetype: string): Promise<ImportResultDto> {
    const parser = this.fileParserFactory.getParser(mimetype);
    // Para CSV se asume que no hay cabecera (mapeo posicional)
    const rawData = parser.parse<any>(buffer, ['codigo', 'nombre', 'capacidad', 'edificio', 'planta', 'tipo']);
    
    let exitos = 0;
    let fallos = 0;
    const detalles: string[] = [];
    const aulasParaGuardar: Aula[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const { codigo, nombre, capacidad, edificio, planta, tipo } = row;
      const capacidadNum = parseInt(capacidad, 10);

      if (!codigo || !nombre || isNaN(capacidadNum) || !edificio || !planta || !tipo) {
        fallos++;
        detalles.push(`Fila ${i + 2}: Datos inválidos o incompletos.`);
        continue;
      }

      const existente = await this.aulaRepository.findOneBy({ codigo });
      if (existente) {
        fallos++;
        detalles.push(`Fila ${i + 2}: El código de aula "${codigo}" ya existe.`);
        continue;
      }

      aulasParaGuardar.push(this.aulaRepository.create({
        codigo,
        nombre,
        capacidad: capacidadNum,
        edificio,
        planta,
        tipo
      }));
      exitos++;
    }

    if (aulasParaGuardar.length > 0) {
      await this.aulaRepository.save(aulasParaGuardar);
    }

    return new ImportResultDto(exitos, fallos, detalles);
  }

  async create(dto: CreateAulaDto): Promise<Aula> {
    const existente = await this.aulaRepository.findOneBy({ codigo: dto.codigo });
    if (existente) {
      throw new ConflictException(`El aula con código ${dto.codigo} ya existe`);
    }

    const nueva = this.aulaRepository.create(dto);
    return this.aulaRepository.save(nueva);
  }

  async update(id: number, dto: UpdateAulaDto): Promise<Aula> {
    const aula = await this.findOne(id);

    if (dto.codigo && dto.codigo !== aula.codigo) {
      const existente = await this.aulaRepository.findOneBy({ codigo: dto.codigo });
      if (existente) {
        throw new ConflictException(`El código ${dto.codigo} ya está en uso por otra aula`);
      }
    }

    Object.assign(aula, dto);
    return this.aulaRepository.save(aula);
  }

  async remove(id: number): Promise<void> {
    const aula = await this.findOne(id);
    await this.aulaRepository.remove(aula);
  }

  async removeBulk(ids: number[]): Promise<void> {
    await this.aulaRepository.delete(ids);
  }

  async getImpacto(id: number): Promise<{ examenesAsociados: number }> {
    // TODO: Inyectar ExamenRepository y realizar el conteo real cuando se implemente el ramillete de Exámenes.
    return { examenesAsociados: 0 };
  }

  async findAll(): Promise<Aula[]> {
    return this.aulaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Aula> {
    const aula = await this.aulaRepository.findOneBy({ id });
    if (!aula) {
      throw new NotFoundException(`Aula con ID ${id} no encontrada`);
    }
    return aula;
  }

  async findByCriterio(criterio: string): Promise<Aula[]> {
    return this.aulaRepository.createQueryBuilder('aula')
      .where('aula.nombre LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('aula.codigo LIKE :criterio', { criterio: `%${criterio}%` })
      .orWhere('aula.edificio LIKE :criterio', { criterio: `%${criterio}%` })
      .orderBy('aula.nombre', 'ASC')
      .getMany();
  }
}
