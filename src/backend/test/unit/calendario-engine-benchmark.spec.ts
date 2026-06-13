import { CalendarioEngine, GeneracionConfig } from '../../src/modules/calendario/calendario-engine';
import { Examen } from '../../src/entities/examen.entity';
import { Aula } from '../../src/entities/aula.entity';
import { Profesor } from '../../src/entities/profesor.entity';
import { Asignatura } from '../../src/entities/asignatura.entity';
import { Grado } from '../../src/entities/grado.entity';

describe('CalendarioEngine - Escenario a Gran Escala (Benchmark)', () => {
  let engine: CalendarioEngine;

  beforeEach(() => {
    engine = new CalendarioEngine();
  });

  it('debe programar 100 exámenes en 3 semanas con 30 aulas y 150 profesores midiendo el rendimiento', () => {
    // 1. Crear 5 Grados
    const grados: Grado[] = [];
    for (let i = 1; i <= 5; i++) {
      const g = new Grado();
      g.id = i;
      g.codigo = `G${i}`;
      g.nombre = `Grado ${i}`;
      grados.push(g);
    }

    // 2. Crear 20 Asignaturas (4 por grado)
    const asignaturas: Asignatura[] = [];
    for (let i = 1; i <= 20; i++) {
      const a = new Asignatura();
      a.id = i;
      a.codigo = `ASIG${i}`;
      a.nombre = `Asignatura ${i}`;
      const grado = grados[(i - 1) % 5];
      a.gradoId = grado.id;
      a.grado = grado;
      a.curso = ((i - 1) % 4) + 1; // Curso entre 1 y 4
      asignaturas.push(a);
    }

    // 3. Crear 30 Aulas
    const aulas: Aula[] = [];
    for (let i = 1; i <= 30; i++) {
      const au = new Aula();
      au.id = i;
      au.codigo = `AU-${i}`;
      au.nombre = `Aula ${i}`;
      au.capacidad = 30;
      aulas.push(au);
    }

    // 4. Crear 150 Profesores (cada uno habilitado para 2 asignaturas aleatorias)
    const profesores: Profesor[] = [];
    for (let i = 1; i <= 150; i++) {
      const p = new Profesor();
      p.id = i;
      p.codigo = `P${i}`;
      p.nombre = `Docente ${i}`;
      p.email = `docente${i}@uneatlantico.es`;
      // Habilitar para un par de asignaturas
      const a1 = asignaturas[(i - 1) % 20];
      const a2 = asignaturas[(i + 3) % 20];
      p.asignaturas = [a1, a2];
      profesores.push(p);
    }

    // 5. Crear 100 Exámenes Pendientes (con asignaturas aleatorias de los grados)
    const examenesPendientes: Examen[] = [];
    for (let i = 1; i <= 100; i++) {
      const ex = new Examen();
      ex.id = i;
      ex.codigo = `EX-${i}`;
      ex.duracion = 120;
      ex.tipo = 'Ordinaria';
      const asignatura = asignaturas[i % 20];
      ex.asignaturaId = asignatura.id;
      ex.asignatura = asignatura;
      ex.totalAlumnos = 25; // Caben en cualquier aula de capacidad 30
      examenesPendientes.push(ex);
    }

    const config: GeneracionConfig = {
      examenesPendientes,
      aulas,
      profesores,
      preferencias: [],
      fechaInicio: '2026-06-15', // Lunes (Inicio del rango de 3 semanas)
      fechaFin: '2026-07-03',    // Viernes (Fin del rango, 3 semanas exactas de lunes a viernes = 15 días laborables)
      franjasHorarias: ['09:00-11:00', '11:30-13:30', '15:00-17:00'], // 3 franjas por día
    };

    const startTime = Date.now();
    const { result, examenesProgramados } = engine.generar(config);
    const durationMs = Date.now() - startTime;

    console.log('--- RESULTADOS BENCHMARK ENGINE ---');
    console.log(`Tiempo de procesamiento: ${durationMs} ms`);
    console.log(`Total Exámenes a Procesar: ${result.totalExamenes}`);
    console.log(`Programados con éxito: ${result.programados}`);
    console.log(`No programados (Conflictos): ${result.noProgramados}`);
    console.log('-----------------------------------');

    expect(durationMs).toBeLessThan(1000); // El algoritmo greedy debe ser súper rápido
    expect(result.programados).toBe(100);  // Debería caber todo perfectamente
    expect(result.exito).toBe(true);
  });
});
