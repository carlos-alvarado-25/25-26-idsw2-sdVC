import { CalendarioEngine, GeneracionConfig } from '../../src/modules/calendario/calendario-engine';
import { Examen } from '../../src/entities/examen.entity';
import { Aula } from '../../src/entities/aula.entity';
import { Profesor } from '../../src/entities/profesor.entity';
import { Asignatura } from '../../src/entities/asignatura.entity';
import { Grado } from '../../src/entities/grado.entity';

describe('CalendarioEngine - Asignación Básica', () => {
  let engine: CalendarioEngine;
  let grado: Grado;
  let asignatura: Asignatura;
  let aula: Aula;
  let profesor: Profesor;

  beforeEach(() => {
    engine = new CalendarioEngine();

    grado = new Grado();
    grado.id = 1;
    grado.codigo = 'G001';
    grado.nombre = 'Grado en Ingeniería Informática';

    asignatura = new Asignatura();
    asignatura.id = 101;
    asignatura.codigo = 'A101';
    asignatura.nombre = 'Programación I';
    asignatura.gradoId = grado.id;
    asignatura.grado = grado;

    aula = new Aula();
    aula.id = 10;
    aula.codigo = 'AU10';
    aula.nombre = 'Aula 10';
    aula.capacidad = 30;

    profesor = new Profesor();
    profesor.id = 50;
    profesor.codigo = 'P50';
    profesor.nombre = 'Manuel Masias';
    profesor.email = 'manuel.masias@uneatlantico.es';
    profesor.asignaturas = [asignatura];
  });

  it('debe programar un examen básico con éxito si hay recursos y slots disponibles', () => {
    const examen = new Examen();
    examen.id = 1;
    examen.codigo = 'EX-01';
    examen.duracion = 120;
    examen.tipo = 'Ordinaria';
    examen.asignaturaId = asignatura.id;
    examen.asignatura = asignatura;
    examen.totalAlumnos = 20;

    const config: GeneracionConfig = {
      examenesPendientes: [examen],
      aulas: [aula],
      profesores: [profesor],
      preferencias: [],
      fechaInicio: '2026-06-15', // Lunes
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.exito).toBe(true);
    expect(result.programados).toBe(1);
    expect(result.noProgramados).toBe(0);
    expect(examenesProgramados.length).toBe(1);
    expect(examenesProgramados[0].fecha).toBe('2026-06-15');
    expect(examenesProgramados[0].hora).toBe('09:00');
    expect(examenesProgramados[0].aulaId).toBe(aula.id);
    expect(examenesProgramados[0].profesorId).toBe(profesor.id);
  });

  it('debe reportar conflictos si no existen slots disponibles en el rango de fechas', () => {
    const examen = new Examen();
    examen.id = 1;
    examen.codigo = 'EX-01';
    examen.duracion = 120;
    examen.tipo = 'Ordinaria';
    examen.asignaturaId = asignatura.id;
    examen.asignatura = asignatura;
    examen.totalAlumnos = 20;

    const config: GeneracionConfig = {
      examenesPendientes: [examen],
      aulas: [aula],
      profesores: [profesor],
      preferencias: [],
      fechaInicio: '2026-06-14', // Domingo (los domingos no se generan slots temporales en el motor)
      fechaFin: '2026-06-14',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.exito).toBe(false);
    expect(result.programados).toBe(0);
    expect(result.noProgramados).toBe(1);
    expect(examenesProgramados.length).toBe(0);
    expect(result.conflictos[0].motivo).toContain('Sin slots o aulas disponibles');
  });
});
