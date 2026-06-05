# IdSw 2 > eliminarProfesor > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarProfesor/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: El elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso `eliminarProfesor()` para la plataforma NestJS + Angular. Este diseño especifica el flujo de borrado seguro, integrando una consulta previa de impacto para cuantificar los exámenes asignados al docente y la eliminación en cascada de sus preferencias horarias antes de la persistencia física en MySQL.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: eliminarProfesor()](/images/02-diseño/casos-uso/eliminarProfesor/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/eliminarProfesor/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| EliminarProfesorView | ProfesorListComponent (Angular) | - |
| - | ProfesorApiService (Angular) | - |
| ProfesorController | - | ProfesorController (NestJS) |
| - | - | ProfesorService (NestJS) |
| ProfesorRepository | - | ProfesorRepository (TypeORM) |
| ExamenRepository | - | ExamenRepository (TypeORM) |
| PreferenciaRepository | - | PreferenciaRepository (TypeORM) |

## Detalles Técnicos

### 1. Communication API

#### Obtener Impacto
- **Endpoint**: `GET /profesores/:id/impacto`
- **Respuesta**: `{ examenesCount: number }`

#### Eliminar Profesor
- **Endpoint**: `DELETE /profesores/:id`
- **Respuesta**: `200 OK` o `204 No Content`.

### 2. Borrado Seguro y Cascada
- Para mitigar la eliminación accidental de docentes con responsabilidades activas, el modal de confirmación en frontend muestra de forma obligatoria el número de exámenes programados que dependen de él.
- Al confirmar la eliminación, el `ProfesorService` en el backend se encarga de:
  - Eliminar todas las restricciones en `PreferenciaRepository` vinculadas al `profesorId`.
  - Eliminar el registro del docente en `ProfesorRepository`. Las relaciones `ManyToMany` (como con `Asignatura`) son resueltas por TypeORM limpiando la tabla intermedia.

## Referencias

- [Análisis: eliminarProfesor](/RUP/01-analisis/casos-uso/eliminarProfesor/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
