import { CalendarioEngine, GeneracionConfig } from '../../src/modules/calendario/calendario-engine';
import { Examen } from '../../src/entities/examen.entity';
import { Aula } from '../../src/entities/aula.entity';
import { Profesor } from '../../src/entities/profesor.entity';
import { Asignatura } from '../../src/entities/asignatura.entity';
import { Grado } from '../../src/entities/grado.entity';
import { Preferencia } from '../../src/entities/preferencia.entity';

describe('CalendarioEngine - Diagnóstico de Conflictos', () => {
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
    grado.nombre = 'Grado en Informática';

    asignatura = new Asignatura();
    asignatura.id = 101;
    asignatura.codigo = 'A101';
    asignatura.nombre = 'Matemáticas I';
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

  it('Caso 1: No hay profesores con esta asignatura asociada', () => {
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
      profesores: [], // Sin profesores calificados
      preferencias: [],
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result } = engine.generar(config);

    expect(result.exito).toBe(false);
    expect(result.conflictos[0].motivo).toBe(
      'No hay profesores con esta asignatura asociada para supervisar el examen'
    );
  });

  it('Caso 2: No hay fechas/franjas laborables disponibles en el rango', () => {
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
      fechaInicio: '2026-06-14', // Domingo (sin slots)
      fechaFin: '2026-06-14',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result } = engine.generar(config);

    expect(result.exito).toBe(false);
    expect(result.conflictos[0].motivo).toContain(
      'No hay fechas/franjas laborables disponibles en el rango solicitado'
    );
  });

  it('Caso 3: No hay aulas con capacidad suficiente', () => {
    const examen = new Examen();
    examen.id = 1;
    examen.codigo = 'EX-01';
    examen.duracion = 120;
    examen.tipo = 'Ordinaria';
    examen.asignaturaId = asignatura.id;
    examen.asignatura = asignatura;
    examen.totalAlumnos = 50; // Supera capacidad de aulaChica (30)

    const config: GeneracionConfig = {
      examenesPendientes: [examen],
      aulas: [aula], // Capacidad 30
      profesores: [profesor],
      preferencias: [],
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result } = engine.generar(config);

    expect(result.exito).toBe(false);
    expect(result.conflictos[0].motivo).toContain(
      'No hay aulas con capacidad suficiente para el total de alumnos matriculados'
    );
  });

  it('Caso 4: No hay aulas físicas disponibles (ocupadas)', () => {
    const examenExistente = new Examen();
    examenExistente.id = 99;
    examenExistente.codigo = 'EX-EXISTENTE';
    examenExistente.fecha = '2026-06-15';
    examenExistente.hora = '09:00';
    examenExistente.duracion = 120;
    examenExistente.aula = aula;
    examenExistente.aulaId = aula.id;

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
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
      examenesExistentes: [examenExistente], // Ocupa el único slot/aula
    };

    const { result } = engine.generar(config);

    expect(result.exito).toBe(false);
    expect(result.conflictos[0].motivo).toContain(
      'No hay aulas físicas disponibles en las franjas horarias solicitadas'
    );
  });

  it('Caso 5: No hay profesores calificados disponibles por exclusiones/cruces', () => {
    const pref = new Preferencia();
    pref.profesorId = profesor.id;
    pref.diaSemana = 1; // Lunes
    pref.horaInicio = '09:00';
    pref.horaFin = '11:00';
    pref.disponible = false; // No disponible

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
      preferencias: [pref], // Exclusión
      fechaInicio: '2026-06-15', // Lunes
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result } = engine.generar(config);

    expect(result.exito).toBe(false);
    expect(result.conflictos[0].motivo).toBe(
      'No hay profesores calificados disponibles en las franjas horarias solicitadas por exclusiones de horario o cruces'
    );
  });
});
