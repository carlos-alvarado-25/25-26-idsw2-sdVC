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

Análisis de colaboración del caso de uso `listarConflictosExamenes()` mediante el patrón MVC. Este análisis se centra en la detección de colisiones de programación **desde el contexto de la gestión de un profesor**, permitiendo identificar y resolver conflictos que afecten la carga docente o las preferencias del personal.

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
- Presentar la lista de conflictos detectados para el profesor en gestión.
- Mostrar detalles del conflicto (Horario, Aula, Alumnos solapados).
- Proveer interfaces para resolver colisiones mediante cambios de programación.
- Notificar el resultado de las actualizaciones en el calendario.

**Colaboraciones**:
- **Entrada**: Recibe `listarConflictos()` desde `:Profesor Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Navega hacia `:Profesor Preferencias Abierto`.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la detección de conflictos específicos del docente.
- Orquestar la búsqueda de alternativas de disponibilidad, cruzando datos de aulas vacías con las restricciones del docente.
- Aplicar resoluciones y persistir cambios en los exámenes.

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

1. **Apertura**: `:Profesor Abierto` (en la ficha del docente) invoca `ListarConflictosView.listarConflictos()`.
2. **Detección Contextual**: La vista solicita `obtenerConflictosDocente()` para el profesor actual.
3. **Indirección Paginada**: El controlador recupera los conflictos desde `ExamenRepository`.
4. **Análisis de Resolución**: El Administrador selecciona un conflicto; la vista solicita `obtenerOpcionesResolucion(conflicto)`.
5. **Búsqueda de Disponibilidad**: El controlador consulta al repositorio de exámenes por aulas o franjas horarias libres.
6. **Cruce con Preferencias**: El controlador filtra las opciones encontradas verificando las restricciones del docente mediante `PreferenciaRepository.verificarRestricciones()`.
7. **Aplicación**: El Administrador selecciona una opción válida; la vista llama a `resolverConflicto(conflicto, resolucion)`.
8. **Sincronización**: El controlador actualiza el `Examen` involucrado y confirma la persistencia en el repositorio.
9. **Finalización**: Se cierra la lista de conflictos y el sistema redirige a `:Profesor Preferencias Abierto` para permitir ajustes en su disponibilidad horaria si fuera necesario.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Inicia desde gestión de profesor|`:Profesor Abierto`|Navegación de entrada|
|Detectar conflictos del profesor|`ExamenRepository`|`detectarConflictosPorProfesor()`|
|Validar opciones con preferencias|`PreferenciaRepository`|`verificarRestricciones(profesor, resolucion)`|
|Finaliza en preferencias|`:Profesor Preferencias Abierto`|Navegación de salida|
|Actualizar calendario|`ExamenRepository`|`actualizar(examen)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: editarProfesor()](/RUP/01-analisis/casos-uso/editarProfesor/README.md)
