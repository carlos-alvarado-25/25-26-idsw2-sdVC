import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignatura } from '../../entities/asignatura.entity';
import { Grado } from '../../entities/grado.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearAsignaturaDto } from './dto/crear-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

import { ImportResultDto } from './dto/import-result.dto';

@Injectable()
export class AsignaturaService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Asignatura)
    private readonly asignaturaRepository: Repository<Asignatura>,
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
  ) {}

  async importar(buffer: Buffer): Promise<ImportResultDto> {
    const content = buffer.toString('utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    let exitos = 0;
    let fallos = 0;
    const detalles: string[] = [];
    const asignaturasParaGuardar: Asignatura[] = [];

    // Cargar todos los grados en memoria para búsqueda rápida por código
    const todosLosGrados = await this.gradoRepository.find();
    const gradosMap = new Map(todosLosGrados.map(g => [g.codigo.toUpperCase(), g]));

    const startIdx = lines[0].toLowerCase().includes('codigo') ? 1 : 0;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',').map(s => s.trim());
      
      if (parts.length < 4) {
        fallos++;
        detalles.push(`Fila ${i + 1}: Datos insuficientes (se requieren 4 columnas).`);
        continue;
      }

      const [codigo, nombre, creditosStr, gradoCodigo] = parts;
      const creditos = parseInt(creditosStr, 10);

      if (!codigo || !nombre || isNaN(creditos) || !gradoCodigo) {
        fallos++;
        detalles.push(`Fila ${i + 1}: Datos inválidos o incompletos.`);
        continue;
      }

      // Validar si ya existe la asignatura
      const existente = await this.asignaturaRepository.findOneBy({ codigo });
      if (existente) {
        fallos++;
        detalles.push(`Fila ${i + 1}: El código de asignatura "${codigo}" ya existe.`);
        continue;
      }

      // Validar si existe el grado
      const grado = gradosMap.get(gradoCodigo.toUpperCase());
      if (!grado) {
        fallos++;
        detalles.push(`Fila ${i + 1}: El grado con código "${gradoCodigo}" no existe.`);
        continue;
      }

      asignaturasParaGuardar.push(this.asignaturaRepository.create({
        codigo,
        nombre,
        creditos,
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
}
