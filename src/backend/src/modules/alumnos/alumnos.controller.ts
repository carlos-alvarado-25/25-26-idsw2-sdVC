import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlumnoService } from './alumnos.service';
import { Alumno } from '../../entities/alumno.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearAlumnoDto } from './dto/crear-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Controller('alumnos')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  async create(@Body() crearAlumnoDto: CrearAlumnoDto) {
    return this.alumnoService.create(crearAlumnoDto);
  }

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.alumnoService.importar(file.buffer, file.mimetype);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    return this.alumnoService.update(id, updateAlumnoDto);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('page') page: string): Promise<PagedResultDto<Alumno>> {
    return this.alumnoService.findByCriterio(q || '', page ? parseInt(page, 10) : 1);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Alumno> {
    return this.alumnoService.findOne(id);
  }

  @Delete('bulk')
  async removeBulk(@Body('ids') ids: number[]) {
    return this.alumnoService.removeBulk(ids);
  }

  @Get()
  async findAll(@Query('page') page: string): Promise<PagedResultDto<Alumno>> {
    return this.alumnoService.findAll(page ? parseInt(page, 10) : 1);
  }
}
