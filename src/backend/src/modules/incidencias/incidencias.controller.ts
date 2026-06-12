import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, UsePipes, ValidationPipe } from '@nestjs/common';
import { IncidenciasService } from './incidencias.service';
import { CrearIncidenciaDto } from './dto/crear-incidencia.dto';
import { UpdateIncidenciaEstadoDto } from './dto/update-incidencia-estado.dto';
import { Incidencia } from '../../entities/incidencia.entity';

@Controller('incidencias')
@UseInterceptors(ClassSerializerInterceptor)
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() crearIncidenciaDto: CrearIncidenciaDto,
    @Query('email') email: string,
  ): Promise<Incidencia> {
    return this.incidenciasService.crear(crearIncidenciaDto, email);
  }

  @Get()
  async findAll(
    @Query('email') email?: string,
    @Query('rol') rol?: string,
  ): Promise<Incidencia[]> {
    if (rol === 'Admin') {
      return this.incidenciasService.listarTodas();
    } else if (rol === 'Profesor' && email) {
      return this.incidenciasService.listarPorProfesor(email);
    }
    return [];
  }

  @Patch(':id/estado')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIncidenciaEstadoDto,
  ): Promise<Incidencia> {
    return this.incidenciasService.actualizarEstado(id, updateDto.estado);
  }
}
