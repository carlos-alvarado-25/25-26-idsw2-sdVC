# IdSw 2 > editarProfesor > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarProfesor/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso `editarProfesor()` para la plataforma NestJS + Angular. Este diseño especifica el flujo de modificación incremental de los datos de un docente, la validación de unicidad de email excluyendo al docente actual y la asignación/desvinculación dinámica de asignaturas (relación Muchos a Muchos) mediante consulta paginada.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: editarProfesor()](/images/02-diseño/casos-uso/editarProfesor/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/editarProfesor/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| EditarProfesorView | ProfesorFormComponent (Angular) | - |
| - | ProfesorApiService (Angular) | - |
| - | AsignaturaApiService (Angular) | - |
| ProfesorController | - | ProfesorController (NestJS) |
| - | - | ProfesorService (NestJS) |
| ProfesorRepository | - | ProfesorRepository (TypeORM) |
| AsignaturaRepository | - | AsignaturaRepository (TypeORM) |
| Profesor | - | Profesor (Entity) |
| Asignatura | - | Asignatura (Entity) |

## Detalles Técnicos

### 1. Comunicación API

#### Obtener Docente
- **Endpoint**: `GET /profesores/:id`
- **Respuesta**: `ProfesorDto` con asignaturas vinculadas.

#### Actualizar Docente
- **Endpoint**: `PATCH /profesores/:id`
- **Cuerpo (Request)**: `UpdateProfesorDto` { nombre?, email?, departamento?, asignaturasIds?: number[] }
- **Respuesta**: `200 OK` + `ProfesorDto`.

### 2. Gestión de Relación Muchos a Muchos (Carga Lectiva)
- En el backend, al recibir `asignaturasIds`, el `ProfesorService` recupera las asignaturas correspondientes desde `AsignaturaRepository` mediante `In(asignaturasIds)`.
- Se asocian a la entidad `profesor.asignaturas = asignaturas` y se persiste con `save(profesor)`. TypeORM gestiona automáticamente la inserción/borrado en la tabla intermedia (relación `ManyToMany`).

### 3. Flujo de Navegación y Estados
- **Guardar**: Actualiza incrementalmente los datos. Permanece en el formulario (`:Profesor Abierto`).
- **Finalizar**: Retorna a la vista principal de listado de docentes (`/admin/profesores`).
- **Cancelar**: Descarta cambios locales no guardados y retorna al listado.

## Frontend

### Implementación

#### ProfesorFormComponent
- Reutiliza el formulario de alta pero inicializando los datos reactivos mediante el servicio `ProfesorApiService.obtener(id)`.
- Integra un buscador dinámico de asignaturas que consume `AsignaturaApiService.search(q, page)` mostrando las asignaturas disponibles con selectores para asociar/desasociar de la colección local antes de hacer persistentes los cambios.

## Referencias

- [Análisis: editarProfesor](/RUP/01-analisis/casos-uso/editarProfesor/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
