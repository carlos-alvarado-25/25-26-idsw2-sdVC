# IdSw 2 > listarConflictosExamenes > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/listarConflictosExamenes/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/listarConflictosExamenes/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-07
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso `listarConflictosExamenes()` y del estado `PROFESOR_PREFERENCIAS_ABIERTO` para la plataforma NestJS + Angular. Este ramillete implementa dos piezas complementarias:

1. **Detección de conflictos de alumnos**: El motor de calendarización asigna exámenes basándose en disponibilidad de aula y profesor, pero no verifica si alumnos del mismo grado tendrían dos exámenes simultáneos. `listarConflictosExamenes` es la herramienta de diagnóstico post-generación que detecta estos solapamientos.
2. **Gestión de Preferencias Horarias** (`PROFESOR_PREFERENCIAS_ABIERTO`): CRUD de exclusiones horarias del profesor, para que el motor las respete en futuras generaciones y evitar los conflictos detectados.

## Decisión de Diseño: El Conflicto Que el Motor No Previene

Los conflictos de **aula** y de **profesor** están prevenidos tanto por el `CalendarioEngine` como por la validación en `ExamenService.update()`. Sin embargo, el motor **no verifica** si dos asignaturas del mismo `Grado` tienen exámenes asignados a la misma franja horaria, lo cual obliga a los alumnos matriculados en ambas a estar en dos sitios a la vez.

Este es el tipo de conflicto que **sí ocurrirá regularmente** en producción y que justifica la existencia de `listarConflictosExamenes`:

```
Asignatura A (gradoId=1) → Examen el Lunes 16/06 a las 10:00
Asignatura B (gradoId=1) → Examen el Lunes 16/06 a las 10:00
→ Todos los alumnos del Grado 1 tienen DOS exámenes simultáneos ❌
→ El motor no lo detecta (no conoce matrículas, sólo disponibilidad de aula/profesor)
```

## Contexto en el Diagrama de Estados

```
PROFESOR_ABIERTO
  └─ listarConflictosExamenes() ──▶ PROFESOR_PREFERENCIAS_ABIERTO
                                          └─ abrirEdicionProfesor() ──▶ PROFESOR_ABIERTO
```

`PROFESOR_PREFERENCIAS_ABIERTO` es un componente Angular independiente (`ProfesorPreferenciasComponent`) con ruta propia, accesible desde `ProfesorFormComponent`. Muestra en paralelo los conflictos detectados y la gestión de preferencias del profesor.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: listarConflictosExamenes()](/images/02-diseño/casos-uso/listarConflictosExamenes/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/listarConflictosExamenes/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| ListarConflictosView | `ProfesorPreferenciasComponent` (Angular) | - |
| - | `PreferenciaApiService` (Angular) | - |
| - | `ExamenApiService` (Angular) | - |
| ExamenController | - | `ExamenController` (NestJS) — nuevo endpoint |
| - | - | `PreferenciaController` (NestJS) — nuevo controlador |
| ExamenRepository | - | `ExamenRepository` (TypeORM) |
| PreferenciaRepository | - | `PreferenciaRepository` (TypeORM) |
| Conflicto (inventada) | `ConflictoAlumnoDto` (interface frontend) | `ConflictoAlumnoDto` (DTO backend) |

## Detalles Técnicos

### 1. Detección de Conflictos (Alumnos, Aula y Profesor)

#### Endpoint
- **`GET /examenes/conflictos?profesorId=:id`**
- **Respuesta**: `ConflictoAlumnoDto[]` (contiene el campo `tipoConflicto: string`)

#### Algoritmo de Detección en `ExamenService`

```
1. Cargar todos los exámenes programados del profesor (fecha IS NOT NULL).
2. Para cada examen del profesor:
   a. Detección 1 (Alumnos/Grado):
      - Buscar exámenes en la misma fecha y mismo gradoId.
      - Si hay solapamiento de horario -> añadir conflicto tipo "Alumnos".
   b. Detección 2 (Aula):
      - Si el examen tiene aulaId, buscar otros exámenes en la misma fecha y aulaId.
      - Si hay solapamiento de horario -> añadir conflicto tipo "Aula".
   c. Detección 3 (Profesor):
      - Si el examen tiene profesorId, buscar otros exámenes del mismo profesor.
      - Si hay solapamiento de horario -> añadir conflicto tipo "Profesor".
3. Evitar duplicados y retornar la lista consolidada de conflictos.
```

#### ConflictoAlumnoDto
```typescript
interface ConflictoAlumnoDto {
  examenId: number;
  examenCodigo: string;
  asignaturaNombre: string;
  gradoNombre: string;
  fecha: string;
  hora: string;
  duracion: number;
  solapaConExamenId: number;
  solapaConExamenCodigo: string;
  solapaConAsignaturaNombre: string;
  motivoConflicto: string;
  tipoConflicto: string; // "Alumnos" | "Aula" | "Profesor"
}
```

### 2. CRUD de Preferencias Horarias (`PROFESOR_PREFERENCIAS_ABIERTO`)

Sub-recurso REST bajo el contexto del profesor:

| Operación | Endpoint | Cuerpo | Respuesta |
|---|---|---|---|
| Listar | `GET /profesores/:id/preferencias` | — | `Preferencia[]` |
| Crear | `POST /profesores/:id/preferencias` | `CrearPreferenciaDto` | `201 + Preferencia` |
| Eliminar | `DELETE /profesores/preferencias/:id` | — | `200 OK` |

#### CrearPreferenciaDto
```typescript
class CrearPreferenciaDto {
  diaSemana: number;   // 1=Lunes ... 5=Viernes
  horaInicio: string;  // HH:MM
  horaFin: string;     // HH:MM
  disponible: boolean; // false = bloqueo/exclusión
}
```

#### Implementación Backend
- `PreferenciaController` se registra bajo `ProfesoresModule`, reutilizando `PreferenciaRepository` ya registrado en `CalendarioModule` — sin crear un módulo independiente.
- `ProfesorService` delega la gestión de preferencias a un método propio, inyectando `PreferenciaRepository`.

### 3. Componente Angular: `ProfesorPreferenciasComponent`

**Ruta**: `/admin/profesores/:id/preferencias`

Componente nuevo con dos secciones en paralelo:

#### Sección A — Conflictos Detectados
- Tabla: `Examen` | `Asignatura` | `Grado` | `Fecha` | `Hora` | `Solapa con` | `[Resolver →]`
- Botón "Resolver" navega a `/admin/examenes/editar/:examenId`
- Si no hay conflictos → mensaje "✅ No se detectan conflictos de alumnos para este profesor"

#### Sección B — Preferencias Horarias
- Tabla: `Día` | `Desde` | `Hasta` | `Tipo` | `[Eliminar]`
- Formulario inline: selector de día (Lunes–Viernes → valores 1–5), hora inicio, hora fin
- Tipo siempre `Exclusión` (disponible: false) en esta versión

### 4. Enlace desde `ProfesorFormComponent`
- Nuevo botón en el header del formulario de edición del profesor (junto al botón "Asignar Examen" existente):
  ```html
  <button [routerLink]="['/admin/profesores', profesorId, 'preferencias']">
    ⚠️ Conflictos y Preferencias
  </button>
  ```

### 5. Flujo de Navegación
- **Entrada**: `PROFESOR_ABIERTO` → botón "Conflictos y Preferencias" → `/admin/profesores/:id/preferencias`
- **Resolver**: botón "Resolver" en la tabla → `/admin/examenes/editar/:id` → admin ajusta el examen → vuelve con "Volver al listado"
- **Volver**: botón "Volver al Profesor" → `/admin/profesores/editar/:id` (estado `PROFESOR_ABIERTO`)

## Referencias

- [Análisis: listarConflictosExamenes](/RUP/01-analisis/casos-uso/listarConflictosExamenes/README.md)
- [Diseño: editarProfesor](/RUP/02-diseño/casos-uso/editarProfesor/README.md)
- [Diseño: editarExamen](/RUP/02-diseño/casos-uso/editarExamen/README.md)
- [Diseño: generarCalendario](/RUP/02-diseño/casos-uso/generarCalendario/README.md)
