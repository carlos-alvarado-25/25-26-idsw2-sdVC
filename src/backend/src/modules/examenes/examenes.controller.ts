import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ExamenService } from './examenes.service';
import { Examen } from '../../entities/examen.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearExamenDto } from './dto/crear-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

@Controller('examenes')
export class ExamenController {
  constructor(private readonly examenService: ExamenService) {}

  @Post()
  async create(@Body() crearExamenDto: CrearExamenDto): Promise<Examen> {
    return this.examenService.create(crearExamenDto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateExamenDto: UpdateExamenDto): Promise<Examen> {
    return this.examenService.update(id, updateExamenDto);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('page') page: string): Promise<PagedResultDto<Examen>> {
    return this.examenService.findByCriterio(q || '', page ? parseInt(page, 10) : 1);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Examen> {
    return this.examenService.findOne(id);
  }

  @Get()
  async findAll(@Query('page') page: string): Promise<PagedResultDto<Examen>> {
    return this.examenService.findAll(page ? parseInt(page, 10) : 1);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.examenService.remove(id);
  }
}
