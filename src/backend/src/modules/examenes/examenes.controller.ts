import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, ParseIntPipe, DefaultValuePipe, Optional,
  UseInterceptors, ClassSerializerInterceptor, Res,
} from '@nestjs/common';
import { ExamenService } from './examenes.service';
import { ExamenExporterFactory } from './services/exporters/exporter.factory';
import { Examen } from '../../entities/examen.entity';
import { PagedResultDto } from '../../common/dto/paged-result.dto';
import { CrearExamenDto } from './dto/crear-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';
import { ConflictoAlumnoDto } from './dto/conflicto-alumno.dto';


@Controller('examenes')
@UseInterceptors(ClassSerializerInterceptor)
export class ExamenController {
  constructor(
    private readonly examenService: ExamenService,
    private readonly exporterFactory: ExamenExporterFactory,
  ) {}

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
    @Query('usuarioId') usuarioId?: string,
  ): Promise<Examen[]> {
    return this.examenService.findCalendario({
      fechaInicio,
      fechaFin,
      gradoId: gradoId ? parseInt(gradoId, 10) : undefined,
      asignaturaId: asignaturaId ? parseInt(asignaturaId, 10) : undefined,
      rol,
      email,
      usuarioId: usuarioId ? parseInt(usuarioId, 10) : undefined,
    });
  }

  @Get('exportar')
  async exportar(
    @Res() res: any,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gradoId') gradoId?: string,
    @Query('asignaturaId') asignaturaId?: string,
    @Query('rol') rol?: string,
    @Query('email') email?: string,
    @Query('formato') formato?: string,
    @Query('incluirAula') incluirAula?: string,
    @Query('incluirProfesor') incluirProfesor?: string,
    @Query('incluirGrado') incluirGrado?: string,
  ) {
    const incAula = incluirAula !== 'false';
    const incProfesor = incluirProfesor !== 'false';
    const incGrado = incluirGrado !== 'false';

    const examenes = await this.examenService.findCalendario({
      fechaInicio,
      fechaFin,
      gradoId: gradoId ? parseInt(gradoId, 10) : undefined,
      asignaturaId: asignaturaId ? parseInt(asignaturaId, 10) : undefined,
      rol,
      email,
    });

    const datosPlanos = examenes.map(ex => ({
      codigo: ex.codigo,
      fecha: ex.fecha || 'Sin fecha',
      hora: ex.hora || 'Sin hora',
      duracion: ex.duracion,
      tipo: ex.tipo,
      nombreAsignatura: ex.nombreAsignatura,
      nombreGrado: ex.asignatura?.nombreGrado || 'Sin Grado',
      nombreAula: ex.nombreAula,
      nombreProfesor: ex.nombreProfesor,
    }));

    const exporter = this.exporterFactory.getExporter(formato || 'excel');
    const buffer = await exporter.exportar(datosPlanos, {
      incluirAula: incAula,
      incluirProfesor: incProfesor,
      incluirGrado: incGrado,
    });

    const isPdf = formato?.toLowerCase() === 'pdf';
    if (isPdf) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=calendario.pdf');
    } else {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=calendario.xlsx');
    }
    res.send(buffer);
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
