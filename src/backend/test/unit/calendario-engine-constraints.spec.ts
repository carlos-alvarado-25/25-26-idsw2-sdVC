import { CalendarioEngine, GeneracionConfig } from '../../src/modules/calendario/calendario-engine';
import { Examen } from '../../src/entities/examen.entity';
import { Aula } from '../../src/entities/aula.entity';
import { Profesor } from '../../src/entities/profesor.entity';
import { Preferencia } from '../../src/entities/preferencia.entity';
import { Asignatura } from '../../src/entities/asignatura.entity';
import { Grado } from '../../src/entities/grado.entity';

describe('CalendarioEngine - Restricciones Duras (Constraints)', () => {
  let engine: CalendarioEngine;
  let grado1: Grado;
  let grado2: Grado;
  let asignatura1: Asignatura;
  let asignatura2: Asignatura;
  let aulaChica: Aula;
  let aulaGrande: Aula;
  let profesor1: Profesor;
  let profesor2: Profesor;

  beforeEach(() => {
    engine = new CalendarioEngine();

    // Setup Grados
    grado1 = new Grado();
    grado1.id = 1;
    grado1.codigo = 'G001';
    grado1.nombre = 'Grado en Ingeniería Informática';

    grado2 = new Grado();
    grado2.id = 2;
    grado2.codigo = 'G002';
    grado2.nombre = 'Grado en ADE';

    // Setup Asignaturas
    asignatura1 = new Asignatura();
    asignatura1.id = 101;
    asignatura1.codigo = 'A101';
    asignatura1.nombre = 'Programación I';
    asignatura1.gradoId = grado1.id;
    asignatura1.grado = grado1;

    asignatura2 = new Asignatura();
    asignatura2.id = 102;
    asignatura2.codigo = 'A102';
    asignatura2.nombre = 'Marketing';
    asignatura2.gradoId = grado2.id;
    asignatura2.grado = grado2;

    // Setup Aulas
    aulaChica = new Aula();
    aulaChica.id = 10;
    aulaChica.codigo = 'AU10';
    aulaChica.nombre = 'Aula 10';
    aulaChica.capacidad = 30;

    aulaGrande = new Aula();
    aulaGrande.id = 20;
    aulaGrande.codigo = 'AU20';
    aulaGrande.nombre = 'Aula 20';
    aulaGrande.capacidad = 100;

    // Setup Profesores
    profesor1 = new Profesor();
    profesor1.id = 50;
    profesor1.codigo = 'P50';
    profesor1.nombre = 'Manuel Masias';
    profesor1.email = 'manuel.masias@uneatlantico.es';
    profesor1.asignaturas = [asignatura1];

    profesor2 = new Profesor();
    profesor2.id = 60;
    profesor2.codigo = 'P60';
    profesor2.nombre = 'Carlos Alvarado';
    profesor2.email = 'carlos.alvarado@uneatlantico.es';
    profesor2.asignaturas = [asignatura2];
  });

  it('no debe programar en un aula con capacidad insuficiente', () => {
    const examen = new Examen();
    examen.id = 1;
    examen.codigo = 'EX-01';
    examen.duracion = 120;
    examen.tipo = 'Ordinaria';
    examen.asignaturaId = asignatura1.id;
    examen.asignatura = asignatura1;
    examen.totalAlumnos = 50; // Supera capacidad de aulaChica (30)

    const config: GeneracionConfig = {
      examenesPendientes: [examen],
      aulas: [aulaChica],
      profesores: [profesor1],
      preferencias: [],
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.exito).toBe(false);
    expect(result.programados).toBe(0);
    expect(result.noProgramados).toBe(1);
    expect(examenesProgramados.length).toBe(0);
    expect(result.conflictos[0].motivo).toContain('Sin slots o aulas disponibles');
  });

  it('debe elegir el aula con capacidad suficiente cuando hay múltiples opciones', () => {
    const examen = new Examen();
    examen.id = 1;
    examen.codigo = 'EX-01';
    examen.duracion = 120;
    examen.tipo = 'Ordinaria';
    examen.asignaturaId = asignatura1.id;
    examen.asignatura = asignatura1;
    examen.totalAlumnos = 50; // Más de 30 (aulaChica), menos de 100 (aulaGrande)

    const config: GeneracionConfig = {
      examenesPendientes: [examen],
      aulas: [aulaChica, aulaGrande],
      profesores: [profesor1],
      preferencias: [],
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.exito).toBe(true);
    expect(examenesProgramados[0].aulaId).toBe(aulaGrande.id);
  });

  it('no debe solapar dos exámenes en la misma aula y misma franja', () => {
    const examen1 = new Examen();
    examen1.id = 1;
    examen1.codigo = 'EX-01';
    examen1.duracion = 120;
    examen1.tipo = 'Ordinaria';
    examen1.asignaturaId = asignatura1.id;
    examen1.asignatura = asignatura1;
    examen1.totalAlumnos = 20;

    const examen2 = new Examen();
    examen2.id = 2;
    examen2.codigo = 'EX-02';
    examen2.duracion = 120;
    examen2.tipo = 'Ordinaria';
    examen2.asignaturaId = asignatura2.id;
    examen2.asignatura = asignatura2;
    examen2.totalAlumnos = 20;

    const config: GeneracionConfig = {
      examenesPendientes: [examen1, examen2],
      aulas: [aulaChica], // Solo un aula disponible
      profesores: [profesor1, profesor2],
      preferencias: [],
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'], // Solo una franja disponible
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.programados).toBe(1);
    expect(result.noProgramados).toBe(1);
    expect(examenesProgramados.length).toBe(1);
  });

  it('debe respetar las preferencias horarias de exclusión del profesor', () => {
    const examen = new Examen();
    examen.id = 1;
    examen.codigo = 'EX-01';
    examen.duracion = 120;
    examen.tipo = 'Ordinaria';
    examen.asignaturaId = asignatura1.id;
    examen.asignatura = asignatura1;
    examen.totalAlumnos = 20;

    // Agregar preferencia de exclusión el Lunes (diaSemana = 1) en la franja 09:00-11:00
    const preferencia = new Preferencia();
    preferencia.profesorId = profesor1.id;
    preferencia.diaSemana = 1; // Lunes
    preferencia.horaInicio = '09:00';
    preferencia.horaFin = '11:00';
    preferencia.disponible = false; // Exclusión (NO disponible)

    const config: GeneracionConfig = {
      examenesPendientes: [examen],
      aulas: [aulaChica],
      profesores: [profesor1],
      preferencias: [preferencia],
      fechaInicio: '2026-06-15', // Lunes
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'],
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.exito).toBe(false); // Falla porque el profesor no está disponible
    expect(examenesProgramados.length).toBe(0);
  });

  it('no debe programar a un profesor para supervisar dos exámenes al mismo tiempo (cruce de profesor)', () => {
    const examen1 = new Examen();
    examen1.id = 1;
    examen1.codigo = 'EX-01';
    examen1.duracion = 120;
    examen1.tipo = 'Ordinaria';
    examen1.asignaturaId = asignatura1.id;
    examen1.asignatura = asignatura1;
    examen1.totalAlumnos = 20;

    const examen2 = new Examen();
    examen2.id = 2;
    examen2.codigo = 'EX-02';
    examen2.duracion = 120;
    examen2.tipo = 'Ordinaria';
    examen2.asignaturaId = asignatura1.id; // Asignada al mismo profesor1
    examen2.asignatura = asignatura1;
    examen2.totalAlumnos = 20;

    const config: GeneracionConfig = {
      examenesPendientes: [examen1, examen2],
      aulas: [aulaChica, aulaGrande], // Dos aulas disponibles
      profesores: [profesor1], // Un solo profesor común
      preferencias: [],
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-15',
      franjasHorarias: ['09:00-11:00'], // Una sola franja
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.programados).toBe(1);
    expect(result.noProgramados).toBe(1); // El segundo examen falla por cruce de profesor
  });
});
