import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AsignaturaService } from './asignaturas.service';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { Asignatura } from '../../entities/asignatura.entity';
import { CrearAsignaturaDto } from './dto/crear-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@Controller('asignaturas')
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  @Post()
  async create(@Body() crearAsignaturaDto: CrearAsignaturaDto) {
    return this.asignaturaService.create(crearAsignaturaDto);
  }

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.asignaturaService.importar(file.buffer);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAsignaturaDto: UpdateAsignaturaDto) {
    return this.asignaturaService.update(id, updateAsignaturaDto);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('page') page: string): Promise<PagedResultDto<Asignatura>> {
    return this.asignaturaService.findByCriterio(q || '', page ? parseInt(page, 10) : 1);
  }

  @Get(':id/impacto')
  async getImpacto(@Param('id', ParseIntPipe) id: number) {
    return this.asignaturaService.getImpacto(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Asignatura> {
    return this.asignaturaService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.asignaturaService.remove(id);
  }

  @Get()
  async findAll(@Query('page') page: string): Promise<PagedResultDto<Asignatura>> {
    return this.asignaturaService.findAll(page ? parseInt(page, 10) : 1);
  }
}
