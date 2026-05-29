# IdSw 2 > listarConflictosExamenes > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.2
- **Fecha**: 2026-05-26
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `listarConflictosExamenes()` mediante el patrón MVC. Este análisis se centra en la detección y resolución de colisiones de programación, actuando como un **centro de diagnóstico compartido** que puede invocarse tanto desde el contexto individual de un profesor como de forma global tras el proceso de generación automática del calendario.

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
- Presentar la lista de conflictos detectados (globales o contextuales al docente).
- Mostrar detalles del conflicto (Horario, Aula, Alumnos solapados).
- Proveer interfaces para resolver colisiones mediante cambios de programación asistidos.
- Facilitar la navegación de retorno según el origen de la solicitud (Ficha de Profesor o Motor de Generación).

**Colaboraciones**:
- **Entrada**: Recibe `listarConflictos()` (desde `:Profesor Abierto`) o `revisarConflictos()` (desde `:GenerarCalendarioView`).
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Navega hacia `:Profesor Preferencias Abierto` o `:Calendario Generado`.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la detección de conflictos masivos o específicos.
- Orquestar la búsqueda de alternativas de disponibilidad cruzando recursos y restricciones.
- Proveer métodos estandarizados para el listado paginado y filtrado de colisiones.
- Aplicar resoluciones y persistir cambios en el calendario académico.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ListarConflictosView`.
- **Repositorio**: Utiliza `ExamenRepository` y `PreferenciaRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Detectar colisiones de programación centradas en un profesor (`detectarConflictosPorProfesor`).
- Proveer disponibilidad de recursos físicos (aulas).
- Actualizar el estado de los exámenes resueltos.

#### PreferenciaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer los datos de restricciones y preferencias horarias del profesor (`verificarRestricciones`).
- Asegurar que las opciones de resolución sugeridas no violen restricciones específicas del docente.

#### Conflicto
**Estereotipo**: Entidad (Inventada)  
**Responsabilidades**:
- Agrupar datos de la colisión académica para su visualización plana.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar los eventos en conflicto.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura Dual**: 
    - El Administrador invoca desde la ficha del docente (`listarConflictos`).
    - El Administrador invoca tras la generación automática (`revisarConflictos`).
2. **Carga Inicial**: La vista solicita `listarConflictos(pagina)` al controlador. El controlador detecta el contexto (si existe un profesor seleccionado o si es una consulta global).
3. **Consulta Paginada**: El controlador recupera los datos desde `ExamenRepository.detectarConflictos(pagina)`.
4. **Filtrado**: El usuario puede aplicar criterios de búsqueda adicionales mediante `filtrarConflictos(criterio, pagina)`, delegando en `ExamenRepository.buscarConflictos(criterio, pagina)`.
5. **Diagnóstico**: Al seleccionar un conflicto, la vista solicita `obtenerOpcionesResolucion(conflicto)`.
6. **Validación de Preferencias**: El controlador cruza huecos libres en aulas con las restricciones del docente involucrado (`PreferenciaRepository`).
7. **Resolución**: El Administrador selecciona una alternativa; el sistema actualiza el `Examen` y sincroniza con el repositorio.
8. **Finalización**: Se notifica el éxito y se retorna al punto de origen (Preferencias del Profesor o Calendario Generado).

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Soportar revisión desde Generación|`ListarConflictosView`|Navegación desde motor|
|Soportar revisión desde Profesor|`ListarConflictosView`|Navegación desde ficha|
|Detección de conflictos|`ExamenRepository`|`detectarConflictos(pagina)`|
|Validar disponibilidad y preferencias|`ExamenController`|Cruce de repositorios|
|Actualizar calendario|`ExamenRepository`|`actualizar(examen)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: editarProfesor()](/RUP/01-analisis/casos-uso/editarProfesor/README.md)
