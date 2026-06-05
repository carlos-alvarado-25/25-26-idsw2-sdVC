import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, ClassSerializerInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfesorService } from './profesores.service';
import { Profesor } from '../../entities/profesor.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearProfesorDto } from './dto/crear-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';

@Controller('profesores')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async create(@Body() crearProfesorDto: CrearProfesorDto) {
    return this.profesorService.create(crearProfesorDto);
  }

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.profesorService.importar(file.buffer, file.mimetype);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProfesorDto: UpdateProfesorDto) {
    return this.profesorService.update(id, updateProfesorDto);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('page') page: string): Promise<PagedResultDto<Profesor>> {
    return this.profesorService.findByCriterio(q || '', page ? parseInt(page, 10) : 1);
  }

  @Get(':id/impacto')
  async getImpacto(@Param('id', ParseIntPipe) id: number): Promise<{ examenesCount: number }> {
    return this.profesorService.getImpacto(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Profesor> {
    return this.profesorService.findOne(id);
  }

  @Delete('bulk')
  async removeBulk(@Body('ids') ids: number[]) {
    return this.profesorService.removeBulk(ids);
  }

  @Get()
  async findAll(@Query('page') page: string): Promise<PagedResultDto<Profesor>> {
    return this.profesorService.findAll(page ? parseInt(page, 10) : 1);
  }
}
