import { CalendarioEngine, GeneracionConfig } from '../../src/modules/calendario/calendario-engine';
import { Examen } from '../../src/entities/examen.entity';
import { Aula } from '../../src/entities/aula.entity';
import { Profesor } from '../../src/entities/profesor.entity';
import { Asignatura } from '../../src/entities/asignatura.entity';
import { Grado } from '../../src/entities/grado.entity';

describe('CalendarioEngine - Heurística de Dispersión (Soft Constraints)', () => {
  let engine: CalendarioEngine;
  let grado: Grado;
  let asignatura: Asignatura;
  let aulaChica: Aula;
  let aulaGrande: Aula;
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

    profesor = new Profesor();
    profesor.id = 50;
    profesor.codigo = 'P50';
    profesor.nombre = 'Manuel Masias';
    profesor.email = 'manuel.masias@uneatlantico.es';
    profesor.asignaturas = [asignatura];
  });

  it('debe aplicar la heurística de dispersión y evitar programar exámenes del mismo grado el mismo día si hay otras opciones', () => {
    const examen1 = new Examen();
    examen1.id = 1;
    examen1.codigo = 'EX-01';
    examen1.duracion = 120;
    examen1.tipo = 'Ordinaria';
    examen1.asignaturaId = asignatura.id;
    examen1.asignatura = asignatura;
    examen1.totalAlumnos = 20;

    const examen2 = new Examen();
    examen2.id = 2;
    examen2.codigo = 'EX-02';
    examen2.duracion = 120;
    examen2.tipo = 'Ordinaria';
    examen2.asignaturaId = asignatura.id; // Mismo grado
    examen2.asignatura = asignatura;
    examen2.totalAlumnos = 20;

    const config: GeneracionConfig = {
      examenesPendientes: [examen1, examen2],
      aulas: [aulaChica, aulaGrande],
      profesores: [profesor],
      preferencias: [],
      fechaInicio: '2026-06-15', // Lunes
      fechaFin: '2026-06-16', // Martes
      franjasHorarias: ['09:00-11:00'],
    };

    const { result, examenesProgramados } = engine.generar(config);

    expect(result.exito).toBe(true);
    expect(examenesProgramados.length).toBe(2);
    // Deben estar en días diferentes debido a la penalización de mismo día (-100)
    expect(examenesProgramados[0].fecha).not.toBe(examenesProgramados[1].fecha);
  });
});
