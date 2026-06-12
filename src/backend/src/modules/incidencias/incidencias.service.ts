import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from '../../entities/incidencia.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Examen } from '../../entities/examen.entity';
import { CrearIncidenciaDto } from './dto/crear-incidencia.dto';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private readonly incidenciaRepository: Repository<Incidencia>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
  ) {}

  async crear(dto: CrearIncidenciaDto, emailProfesor: string): Promise<Incidencia> {
    // Buscar profesor por email
    const profesor = await this.profesorRepository.findOneBy({ email: emailProfesor });
    if (!profesor) {
      throw new NotFoundException(`Profesor con email "${emailProfesor}" no registrado`);
    }

    // Buscar examen
    const examen = await this.examenRepository.findOneBy({ id: dto.examenId });
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${dto.examenId} no encontrado`);
    }

    // Validar que el examen esté asignado al profesor en sesión
    if (examen.profesorId !== profesor.id) {
      throw new ForbiddenException('No tiene permisos para reportar incidencias en exámenes de otros docentes');
    }

    const nueva = this.incidenciaRepository.create({
      tipo: dto.tipo,
      descripcion: dto.descripcion,
      examenId: dto.examenId,
      profesorId: profesor.id,
    });

    const guardada = await this.incidenciaRepository.save(nueva);
    
    // Cargar relaciones para retornar objeto completo expuesto
    const result = await this.incidenciaRepository.findOne({
      where: { id: guardada.id },
      relations: {
        examen: {
          asignatura: true,
        },
        profesor: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Error al recuperar la incidencia guardada con ID ${guardada.id}`);
    }

    return result;
  }

  async listarPorProfesor(emailProfesor: string): Promise<Incidencia[]> {
    const profesor = await this.profesorRepository.findOneBy({ email: emailProfesor });
    if (!profesor) {
      throw new NotFoundException(`Profesor con email "${emailProfesor}" no registrado`);
    }

    return this.incidenciaRepository.find({
      where: { profesorId: profesor.id },
      relations: {
        examen: {
          asignatura: true,
        },
        profesor: true,
      },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async listarTodas(): Promise<Incidencia[]> {
    return this.incidenciaRepository.find({
      relations: {
        examen: {
          asignatura: true,
        },
        profesor: true,
      },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async actualizarEstado(id: number, estado: string): Promise<Incidencia> {
    const incidencia = await this.incidenciaRepository.findOne({
      where: { id },
      relations: {
        examen: {
          asignatura: true,
        },
        profesor: true,
      },
    });

    if (!incidencia) {
      throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    }

    incidencia.estado = estado;
    return this.incidenciaRepository.save(incidencia);
  }
}
