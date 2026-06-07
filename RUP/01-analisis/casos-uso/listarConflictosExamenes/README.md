# IdSw 2 > listarConflictosExamenes > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|[📐 Diseño](/RUP/02-diseño/casos-uso/listarConflictosExamenes/README.md)|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/listarConflictosExamenes/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.3
- **Fecha**: 2026-06-07
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `listarConflictosExamenes()` mediante el patrón MVC. Este análisis se centra en la detección de conflictos de programación y en la gestión de preferencias horarias del profesor en el estado `PROFESOR_PREFERENCIAS_ABIERTO`.

El sistema detecta tres tipos de conflictos:
1. **Conflictos de Alumnos (Solapamiento de Grado)**: Dos asignaturas del mismo grado tienen exámenes asignados a la misma fecha y hora. Esto imposibilita la asistencia de los estudiantes matriculados en ambas.
2. **Conflictos de Profesor**: Un profesor tiene dos exámenes asignados en la misma franja horaria.
3. **Sobreposición de Aulas**: Dos exámenes están programados en la misma aula al mismo tiempo.

## diagrama de colaboración

<div align=center>

|![Análisis: listarConflictosExamenes()](/images/01-analisis/casos-uso/listarConflictosExamenes/listarConflictosExamenes-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/listarConflictosExamenes/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarConflictosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la lista de conflictos detectados (solapamientos de grado, profesores o aulas).
- Mostrar la interfaz de gestión de preferencias del profesor (exclusiones horarias).
- Proveer enlace para solicitar resolver cada conflicto (redirigiendo a la edición del examen correspondiente).
- Permitir al administrador cerrar la lista y volver a la ficha del profesor.

**Colaboraciones**:
- **Entrada**: Invocado desde la ficha del docente (`listarConflictosExamenes()`).
- **Control**: Se comunica con `ExamenController` y `PreferenciaController`.
- **Salida**: Navega hacia `:Profesor Preferencias Abierto` (vista propia) o redirecciona a `:Editar Examen` para resolver colisiones.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Recibir solicitudes de detección de conflictos para los exámenes de un profesor.
- Coordinar la búsqueda de exámenes solapantes en la base de datos (mismo grado, profesor o aula).
- Retornar la lista de objetos `Conflicto`.

#### PreferenciaController
**Estereotipo**: Control  
**Responsabilidades**:
- Proveer endpoints para listar, crear y eliminar preferencias horarias de un profesor.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Recuperar los exámenes programados de un profesor.
- Consultar exámenes candidatos que puedan causar sobreposición de grado, profesor o aula en una fecha/hora dada.

#### PreferenciaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Persistir y gestionar las exclusiones horarias de los profesores.

#### Conflicto
**Estereotipo**: Entidad (DATO/DTO)  
**Responsabilidades**:
- Encapsular la información de una colisión horaria (código de examen, asignatura, grado, aula, fecha, hora y descripción del motivo).

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar los eventos de exámenes programados.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: El administrador solicita ver conflictos y preferencias desde la edición de un profesor.
2. **Carga de Preferencias**: `ListarConflictosView` solicita a `PreferenciaController` la lista de exclusiones horarias actuales del profesor, quien consulta a `PreferenciaRepository`.
3. **Carga de Conflictos**: `ListarConflictosView` solicita a `ExamenController` la lista de conflictos.
4. **Detección de Colisiones**: `ExamenController` pide a `ExamenRepository` los exámenes programados del profesor. Para cada uno, busca otros exámenes en la misma fecha y hora que compartan el mismo `gradoId` (conflictos de alumnos), `profesorId` (conflictos de profesor), o `aulaId` (sobreposición de aula).
5. **Visualización**: La vista muestra las exclusiones y los conflictos detectados.
6. **Resolución**: Si el usuario pulsa "Resolver", la vista navega al flujo de `:Editar Examen` para reajustar los horarios.
7. **Gestión de Restricciones**: El usuario puede crear o eliminar exclusiones horarias (días y horas donde el profesor no puede examinar). Estas restricciones serán tomadas en cuenta por el motor en futuras generaciones automáticas.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|---|---|---|
|Presentar lista de conflictos|`ListarConflictosView`|Renderización de conflictos|
|Detección de solapamiento de horario, aulas, profesores y alumnos|`ExamenController` / `ExamenRepository`|`obtenerConflictos(profesorId)` / `detectarConflictos()`|
|Permitir resolver cada conflicto|`ListarConflictosView`|Enlace a `:Editar Examen` con el ID correspondiente|
|Gestión de exclusiones horarias|`PreferenciaController` / `PreferenciaRepository`|CRUD de Preferencias|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: editarProfesor](/RUP/01-analisis/casos-uso/editarProfesor/README.md)
- [Análisis: editarExamen](/RUP/01-analisis/casos-uso/editarExamen/README.md)
