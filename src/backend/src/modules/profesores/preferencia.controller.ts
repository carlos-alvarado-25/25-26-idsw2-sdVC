import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfesorService } from './profesores.service';
import { CrearPreferenciaDto } from './dto/crear-preferencia.dto';
import { Preferencia } from '../../entities/preferencia.entity';

@Controller('profesores')
export class PreferenciaController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Get(':id/preferencias')
  async findPreferencias(@Param('id', ParseIntPipe) id: number): Promise<Preferencia[]> {
    return this.profesorService.findPreferencias(id);
  }

  @Post(':id/preferencias')
  async createPreferencia(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CrearPreferenciaDto,
  ): Promise<Preferencia> {
    return this.profesorService.createPreferencia(id, dto);
  }

  @Delete('preferencias/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePreferencia(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.profesorService.removePreferencia(id);
  }
}
