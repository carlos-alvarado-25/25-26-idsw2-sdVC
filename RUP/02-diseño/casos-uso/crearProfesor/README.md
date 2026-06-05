# IdSw 2 > crearProfesor > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearProfesor/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso `crearProfesor()` para la plataforma NestJS + Angular. Este diseño implementa el patrón "El Delgado", especificando el flujo desde la captura inicial de datos de docentes hasta la persistencia en base de datos y la transición automática al estado de edición para configurar su carga lectiva.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: crearProfesor()](/images/02-diseño/casos-uso/crearProfesor/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/crearProfesor/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| CrearProfesorView | ProfesorFormComponent (Angular) | - |
| - | ProfesorApiService (Angular) | - |
| ProfesorController | - | ProfesorController (NestJS) |
| - | - | ProfesorService (NestJS) |
| ProfesorRepository | - | ProfesorRepository (TypeORM) |
| Profesor | - | Profesor (Entity) |

## Detalles Técnicos

### 1. Comunicación API
- **Endpoint**: `POST /profesores`
- **Cuerpo (Request)**: `CrearProfesorDto` { codigo, nombre, email, departamento }
- **Respuesta Exitosa**: `201 Created` + `ProfesorDto` (incluye el ID generado).
- **Validaciones**:
  - `codigo`: Requerido, único, formato texto (class-validator).
  - `nombre`: Requerido, formato texto.
  - `email`: Requerido, único, formato email válido.
  - `departamento`: Requerido, formato de catálogo de departamentos.

### 2. Flujo de Navegación (Patrón El Delgado)
- Al recibir la respuesta exitosa `201 Created` con el ID asignado, el frontend (`ProfesorFormComponent`) utiliza el router de Angular para redirigir a la vista de edición: `/admin/profesores/editar/:id`.
- Esto permite continuar con la edición avanzada, como la asignación de asignaturas al docente recién creado, manteniendo la fluidez de trabajo.

### 3. Gestión de Errores
- Si el email o código ya existen, el controlador devuelve un `409 Conflict` tras lanzar un `ConflictException` en el service del backend.

## Frontend

### Implementación

#### ProfesorFormComponent
- **Reactive Forms**: Gestión del formulario reactivo a través de `FormBuilder`.
- **Modo Creación**: Opera en alta al no detectar parámetros de ID en la ruta.
- **Redirección**: Navegación automática mediante el `Router` al recibir confirmación.

## Referencias

- [Análisis: crearProfesor](/RUP/01-analisis/casos-uso/crearProfesor/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
