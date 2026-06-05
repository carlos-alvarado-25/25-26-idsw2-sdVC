import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, ClassSerializerInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GradoService } from './grados.service';
import { CrearGradoDto } from './dto/crear-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';

@Controller('grados')
@UseInterceptors(ClassSerializerInterceptor)
export class GradoController {
  constructor(private readonly gradoService: GradoService) {}

  @Post()
  async create(@Body() crearGradoDto: CrearGradoDto) {
    return this.gradoService.create(crearGradoDto);
  }

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.gradoService.importar(file.buffer, file.mimetype);
  }

  @Get('search')
  async search(@Query('q') q: string, @Query('page') page: string) {
    return this.gradoService.findByCriterio(q || '', page ? parseInt(page, 10) : 1);
  }

  @Get(':id/impacto')
  async getImpacto(@Param('id', ParseIntPipe) id: number) {
    return this.gradoService.countDependencies(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gradoService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateGradoDto: UpdateGradoDto) {
    return this.gradoService.update(id, updateGradoDto);
  }

  @Delete('bulk')
  async removeBulk(@Body('ids') ids: number[]) {
    return this.gradoService.removeBulk(ids);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.gradoService.remove(id);
  }

  @Get()
  async findAll(@Query('page') page: string) {
    return this.gradoService.findAll(page ? parseInt(page, 10) : 1);
  }
}
