import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, ParseIntPipe, DefaultValuePipe, Optional,
  UseInterceptors, ClassSerializerInterceptor,
} from '@nestjs/common';
import { ExamenService } from './examenes.service';
import { Examen } from '../../entities/examen.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearExamenDto } from './dto/crear-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';
import { ConflictoAlumnoDto } from './dto/conflicto-alumno.dto';


@Controller('examenes')
@UseInterceptors(ClassSerializerInterceptor)
export class ExamenController {
  constructor(private readonly examenService: ExamenService) {}

  @Post()
  async create(@Body() crearExamenDto: CrearExamenDto): Promise<Examen> {
    return this.examenService.create(crearExamenDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamenDto: UpdateExamenDto,
  ): Promise<Examen> {
    return this.examenService.update(id, updateExamenDto);
  }

  @Get('calendario')
  async findCalendario(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gradoId') gradoId?: string,
    @Query('asignaturaId') asignaturaId?: string,
    @Query('rol') rol?: string,
    @Query('email') email?: string,
  ): Promise<Examen[]> {
    return this.examenService.findCalendario({
      fechaInicio,
      fechaFin,
      gradoId: gradoId ? parseInt(gradoId, 10) : undefined,
      asignaturaId: asignaturaId ? parseInt(asignaturaId, 10) : undefined,
      rol,
      email,
    });
  }

  @Get('conflictos')
  async findConflictos(
    @Query('profesorId', ParseIntPipe) profesorId: number,
  ): Promise<ConflictoAlumnoDto[]> {
    return this.examenService.findConflictosAlumnos(profesorId);
  }

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<PagedResultDto<Examen>> {
    return this.examenService.findByCriterio(q || '', page);
  }

  @Get('sin-profesor')
  async findSinProfesor(
    @Query('q') q: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<PagedResultDto<Examen>> {
    return this.examenService.findSinProfesor(q || '', page);
  }

  @Get(':id/conflicto-profesor')
  async verificarConflictoProfesor(
    @Param('id', ParseIntPipe) id: number,
    @Query('profesorId', new DefaultValuePipe(0), ParseIntPipe) profesorId: number,
  ): Promise<{ tieneConflicto: boolean; descripcion?: string }> {
    return this.examenService.verificarConflictoProfesor(id, profesorId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Examen> {
    return this.examenService.findOne(id);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<PagedResultDto<Examen>> {
    return this.examenService.findAll(page);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.examenService.remove(id);
  }
}
