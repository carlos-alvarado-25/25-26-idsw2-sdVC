# IdSw 2 > eliminarAlumno > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-28
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `eliminarAlumno()` mediante el patrón MVC. Este artefacto define el flujo para la eliminación de perfiles de estudiantes, asegurando que el Administrador visualice los datos clave (incluyendo curso y grado) antes de confirmar la operación destructiva.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarAlumno()](/images/01-analisis/casos-uso/eliminarAlumno/eliminarAlumno-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/eliminarAlumno/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarAlumnoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar los datos del alumno (matrícula, nombre, grado, curso) y solicitar confirmación.
- Gestionar las acciones de confirmar o cancelar la operación.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarAlumno(alumno)` desde `:Alumnos Abierto`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: Retorna a `:Alumnos Abierto`.

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar el flujo de eliminación.
- Delegar la eliminación física del perfil al repositorio de alumnos.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EliminarAlumnoView`.
- **Repositorio**: Utiliza `AlumnoRepository`.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Ejecutar la eliminación del objeto `Alumno` en el almacenamiento permanente.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del estudiante a eliminar.
- **Delegación**: Facilitar el acceso a los datos de su grado vinculado para su visualización en la confirmación.

**Colaboraciones**:
- **Entidad**: Se vincula con `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer la información académica (nombre del grado) para la confirmación de eliminación.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El Administrador solicita eliminar un estudiante desde el listado.
2. **Carga**: `:Alumnos Abierto` invoca `EliminarAlumnoView.eliminarAlumno(alumno)`.
3. **Presentación**: La vista muestra los datos del alumno (matrícula, nombre, grado y curso) y solicita confirmación.
4. **Confirmación**: El Administrador selecciona **Confirmar**.
5. **Persistencia Destructiva**: `AlumnoController` solicita `AlumnoRepository.eliminar(alumno)`.
6. **Finalización**: Se notifica el éxito y se retorna al listado general (`abrirAlumnos()`).

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar datos del alumno a eliminar|`EliminarAlumnoView`|Renderizado inicial|
|Mostrar grado y curso actual|`EliminarAlumnoView`|Renderizado inicial|
|Confirmar eliminación|`EliminarAlumnoView`|Interfaz de usuario|
|Eliminar alumno de la base de datos|`AlumnoRepository`|`eliminar(alumno)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAlumnos()](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)
