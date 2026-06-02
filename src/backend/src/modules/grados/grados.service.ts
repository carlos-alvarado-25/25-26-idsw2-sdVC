import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Grado } from '../../entities/grado.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearGradoDto } from './dto/crear-grado.dto';

@Injectable()
export class GradoService {
  private readonly PAGE_SIZE = 10;

  constructor(
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>,
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
