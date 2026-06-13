# IdSw 2 > crearProfesor > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearProfesor/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/crearProfesor/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso `crearProfesor()` para la plataforma NestJS + Angular. Este diseño implementa el patrón "El Delgado", especificando el flujo desde la captura inicial de datos de docentes hasta la persistencia en base de datos, la creación atómica de credenciales de usuario asociadas y la transición automática al estado de edición para configurar su carga lectiva.

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
| UsuarioRepository | - | UsuarioRepository (TypeORM) |
| Usuario | - | Usuario (Entity) |
| ProfesorRepository | - | ProfesorRepository (TypeORM) |
| Profesor | - | Profesor (Entity) |

## Detalles Técnicos

### 1. Comunicación API
- **Endpoint**: `POST /profesores`
- **Cuerpo (Request)**: `CrearProfesorDto` { codigo, nombre, email, departamento }
- **Respuesta Exitosa**: `201 Created` + `ProfesorDto` (incluye el ID generado y el `usuarioId`).
- **Validaciones**:
  - `codigo`: Requerido, único, formato texto (class-validator).
  - `nombre`: Requerido, formato texto.
  - `email`: Requerido, único, formato email válido.
  - `departamento`: Requerido, formato de catálogo de departamentos.

### 2. Flujo de Navegación (Patrón El Delgado)
- Al recibir la respuesta exitosa `201 Created` con el ID asignado, el frontend (`ProfesorFormComponent`) utiliza el router de Angular para redirigir a la vista de edición: `/admin/profesores/editar/:id`.
- Esto permite continuar con la edición avanzada, como la asignación de asignaturas al docente recién creado, manteniendo la fluidez de trabajo.

### 3. Gestión de Errores y Transaccionalidad
- Si el email o código ya existen, el controlador devuelve un `409 Conflict` tras lanzar un `ConflictException` en el service del backend.
- **Transacción Atómica**: El proceso se envuelve en un `QueryRunner` transaccional. La creación del registro de `Usuario` (con credenciales y contraseña predeterminada `idsw2_2026` cifrada mediante bcrypt, con rol `Profesor`) y de la entidad `Profesor` se realizan de forma atómica.
- **Vinculación 1:1**: El docente queda vinculado con su correspondiente registro de seguridad a través de la FK `usuarioId`.

## Frontend

### Implementación

#### ProfesorFormComponent
- **Reactive Forms**: Gestión del formulario reactivo a través de `FormBuilder`.
- **Modo Creación**: Opera en alta al no detectar parámetros de ID en la ruta.
- **Redirección**: Navegación automática mediante el `Router` al recibir confirmación.

## Referencias

- [Análisis: crearProfesor](/RUP/01-analisis/casos-uso/crearProfesor/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
