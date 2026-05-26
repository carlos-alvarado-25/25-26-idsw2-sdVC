# IdSw 2 > editarProfesor > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-26
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `editarProfesor()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y las dependencias necesarias con la entidad `Asignatura` para la actualización de perfiles docentes y gestión de carga lectiva.

## diagrama de colaboración

<div align=center>

|![Análisis: editarProfesor()](/images/01-analisis/casos-uso/editarProfesor/editarProfesor-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/editarProfesor/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Cargar y presentar los datos actuales del profesor al Administrador.
- Proveer una interfaz de búsqueda paginada para la asignación/desvinculación de asignaturas.
- Capturar las modificaciones en el formulario de perfil y el listado de materias impartidas.
- Gestionar las acciones de guardado y cancelación.
- Notificar el resultado de la actualización.

**Colaboraciones**:
- **Entrada**: Recibe `editarProfesor(profesor)` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Retorna a `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la carga de perfiles y dependencias (Departamentos y Asignaturas searchable).
- Validar la integridad de los cambios y la unicidad del email (excluyendo el profesor actual).
- Orquestar la actualización de la carga lectiva vinculada al docente.
- Aplicar los cambios a la entidad `Profesor` y delegar su persistencia.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EditarProfesorView`.
- **Repositorio**: Utiliza `ProfesorRepository` y `AsignaturaRepository`.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Persistir los cambios del objeto `Profesor` en el almacenamiento permanente.
- Verificar conflictos de email excluyendo la identidad actual.

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer búsqueda paginada de asignaturas para la gestión de la carga lectiva del docente.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del perfil docente.
- Gestionar su propia colección de asignaturas impartidas.
- **Delegación**: Exponer información resumida de su carga lectiva siguiendo la Ley de Demeter.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar las materias que pueden ser asignadas al profesor.

## flujo de colaboración

### secuencia de operaciones

1. **Carga**: `:Profesores Abierto` invoca `EditarProfesorView.editarProfesor(profesor)`.
2. **Contexto**: La vista solicita al controlador los departamentos y la búsqueda de asignaturas para gestionar la carga docente.
3. **Modificación**: El Administrador cambia datos de perfil y selecciona/deselecciona materias.
4. **Validación**: `ProfesorController` verifica la unicidad del email y la validez de las nuevas asignaciones.
5. **Cambio de Estado**: `ProfesorController` actualiza la entidad `Profesor` en memoria (`<<update>>`).
6. **Sincronización**: `ProfesorController` entrega el objeto a `ProfesorRepository.actualizar(profesor)`.
7. **Finalización**: Se notifica el éxito y se retorna al listado general.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar datos de edición|`EditarProfesorView`|Carga inicial de datos|
|Modificar código, nombre, email, dpto|`EditarProfesorView`|Inputs del formulario|
|Asignar/Desasignar materias|`AsignaturaRepository`|`buscarPaginadas(criterio, pagina)`|
|Guardar cambios en base de datos|`ProfesorRepository`|`actualizar(profesor)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirProfesores()](/RUP/01-analisis/casos-uso/abrirProfesores/README.md)
