# IdSw 2 > editarAlumno > Análisis

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

Análisis de colaboración del caso de uso `editarAlumno()` mediante el patrón MVC. Este artefacto define la estructura necesaria para modificar la información de los estudiantes y gestionar su vinculación académica, aplicando el estándar de persistencia incremental que mantiene al Administrador en el estado de edición singular para optimizar la eficiencia operativa.

## diagrama de colaboración

<div align=center>

|![Análisis: editarAlumno()](/images/01-analisis/casos-uso/editarAlumno/editarAlumno-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/editarAlumno/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarAlumnoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Cargar y presentar los datos actuales del alumno al Administrador.
- Capturar las modificaciones en el formulario (Nombre, Email, Curso, Grado).
- Proveer una interfaz para la reasignación del grado académico.
- Gestionar la persistencia incremental permitiendo permanecer en el estado de edición.
- Facilitar el retorno al listado general mediante las acciones de finalizar o cancelar.

**Colaboraciones**:
- **Entrada**: Recibe `editarAlumno(alumno)` desde `:Alumnos Abierto`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: 
    - Transición `<<editar>>` hacia `:Alumno Abierta` (permanencia).
    - Transición `<<finalizar>>` o `<<cancelar>>` hacia `:Alumnos Abierto` (retorno al listado).

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la actualización de la entidad `Alumno`.
- Proveer el catálogo de grados disponibles para la reasignación académica.
- Aplicar los cambios a la instancia de la entidad y delegar su persistencia en el repositorio.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EditarAlumnoView`.
- **Repositorio**: Utiliza `AlumnoRepository` y `GradoRepository`.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Persistir los cambios del objeto `Alumno` en el almacenamiento permanente (`actualizar`).

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proporcionar la colección de grados académicos disponibles (`obtenerTodos`).

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del estudiante y permitir su actualización controlada.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la dependencia académica vinculada al alumno.

## flujo de colaboración

### secuencia de operaciones

1. **Carga**: `:Alumnos Abierto` solicita `editarAlumno(alumno)` y la vista muestra los datos actuales.
2. **Carga de Contexto**: La vista solicita al controlador la lista conceptual de grados: `obtenerGradosDisponibles()`.
3. **Edición Incremental**: El Administrador modifica datos y selecciona **Guardar**.
4. **Persistencia**: `AlumnoController` actualiza la entidad `Alumno` (`<<update>>`) y sincroniza con `AlumnoRepository.actualizar(alumno)`.
5. **Estado Estable (Singular)**: Se confirma el éxito y se transita al estado `:Alumno Abierta`, permitiendo continuar con la edición.
6. **Retorno al Listado (Plural)**: 
    - Al seleccionar **Finalizar**, se invoca `abrirAlumnos()` y se retorna a `:Alumnos Abierto`.
    - Al seleccionar **Cancelar**, se retorna a `:Alumnos Abierto` descartando cambios no guardados.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar datos de edición|`EditarAlumnoView`|Carga inicial de datos|
|Modificar nombre, email, curso, grado|`EditarAlumnoView`|Inputs del formulario|
|Seleccionar grado diferente|`GradoRepository`|`obtenerTodos()`|
|Guardar cambios en base de datos|`AlumnoRepository`|`actualizar(alumno)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAlumnos()](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)
