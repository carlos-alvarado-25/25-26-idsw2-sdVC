import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GradoService } from './grados.service';
import { CrearGradoDto } from './dto/crear-grado.dto';

@Controller('grados')
export class GradoController {
  constructor(private readonly gradoService: GradoService) {}

  @Post()
  async create(@Body() crearGradoDto: CrearGradoDto) {
    return this.gradoService.create(crearGradoDto);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('page') page: string) {
    console.log(`[GradoController] Buscando por criterio: "${q}", página: ${page}`);
    return this.gradoService.findByCriterio(q || '', page ? parseInt(page, 10) : 1);
  }

  @Get()
  async findAll(@Query('page') page: string) {
    console.log(`[GradoController] Listado general, página: ${page}`);
    return this.gradoService.findAll(page ? parseInt(page, 10) : 1);
  }
}
