import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Between } from 'typeorm';
import { Examen } from '../../entities/examen.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Preferencia } from '../../entities/preferencia.entity';
import { GenerarCalendarioDto } from './dto/generar-calendario.dto';
import { GeneracionResultDto } from './dto/generacion-result.dto';
import { ConfirmarCalendarioDto } from './dto/confirmar-calendario.dto';
import { CalendarioEngine } from './calendario-engine';

@Injectable()
export class CalendarioService {
  constructor(
    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Preferencia)
    private readonly preferenciaRepository: Repository<Preferencia>,
  ) {}

  async generar(dto: GenerarCalendarioDto): Promise<GeneracionResultDto> {
    const examenesPendientes = await this.examenRepository.find({
      where: { fecha: IsNull() },
      relations: { asignatura: true },
    });

    if (examenesPendientes.length === 0) {
      return {
        exito: true,
        totalExamenes: 0,
        programados: 0,
        noProgramados: 0,
        conflictos: [],
      };
    }

    const examenesExistentes = await this.examenRepository.find({
      where: {
        fecha: Between(dto.fechaInicio, dto.fechaFin),
      },
      relations: { aula: true, profesor: true },
    });

    const aulas = await this.aulaRepository.find();
    const profesores = await this.profesorRepository.find({
      relations: { asignaturas: true },
    });
    const preferencias = await this.preferenciaRepository.find();

    examenesPendientes.forEach(examen => {
      examen.totalAlumnos = 0;
    });

    const engine = new CalendarioEngine();
    const { result, examenesProgramados } = engine.generar({
      examenesPendientes,
      aulas,
      profesores,
      preferencias,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      franjasHorarias: dto.franjasHorarias,
      examenesExistentes,
    });

    result.propuesta = examenesProgramados.map(ex => ({
      examenId: ex.id,
      fecha: ex.fecha!,
      hora: ex.hora!,
      aulaId: ex.aulaId!,
      profesorId: ex.profesorId,
    }));

    return result;
  }

  async confirmar(dto: ConfirmarCalendarioDto): Promise<void> {
    const ids = dto.asignaciones.map(a => a.examenId);
    if (ids.length === 0) return;

    const examenes = await this.examenRepository.find({
      where: { id: In(ids) },
    });

    const mapaAsignaciones = new Map<number, typeof dto.asignaciones[0]>();
    dto.asignaciones.forEach(a => mapaAsignaciones.set(a.examenId, a));

    examenes.forEach(ex => {
      const asignacion = mapaAsignaciones.get(ex.id);
      if (asignacion) {
        ex.fecha = asignacion.fecha;
        ex.hora = asignacion.hora;
        ex.aulaId = asignacion.aulaId;
        ex.profesorId = asignacion.profesorId || null;
      }
    });

    await this.examenRepository.save(examenes);
  }
}
