import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AulaService } from './aulas.service';
import { Aula } from '../../entities/aula.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Controller('aulas')
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  @Post()
  async create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulaService.create(createAulaDto);
  }

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  async importar(@UploadedFile() file: Express.Multer.File) {
    return this.aulaService.importar(file.buffer);
  }

  @Get('search')
  async search(@Query('q') q: string): Promise<Aula[]> {
    return this.aulaService.findByCriterio(q || '');
  }

  @Get(':id/impacto')
  async getImpacto(@Param('id', ParseIntPipe) id: number) {
    return this.aulaService.getImpacto(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Aula> {
    return this.aulaService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete('bulk')
  async removeBulk(@Body('ids') ids: number[]) {
    return this.aulaService.removeBulk(ids);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.aulaService.remove(id);
  }

  @Get()
  async findAll(): Promise<Aula[]> {
    return this.aulaService.findAll();
  }
}
