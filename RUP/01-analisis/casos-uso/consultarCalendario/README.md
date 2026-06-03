# IdSw 2 > consultarCalendario > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-29
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `consultarCalendario()` mediante el patrón MVC. Este artefacto define la estructura compartida para que Administradores, Profesores y Alumnos visualicen la programación de exámenes, aplicando filtros contextuales basados en la sesión del usuario y permitiendo la navegación hacia la descarga de documentos o comunicación de incidencias.

## diagrama de colaboración

<div align=center>

|![Análisis: consultarCalendario()](/images/01-analisis/casos-uso/consultarCalendario/consultarCalendario-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/consultarCalendario/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ConsultarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Representar gráficamente el calendario de exámenes (mes/semana/día).
- Proveer controles para navegar por rangos de fechas y aplicar filtros de búsqueda.
- Facilitar el acceso a las colaboraciones de descarga e incidencias.

**Colaboraciones**:
- **Entrada**: Recibe `consultarCalendario()` desde `:Sistema Disponible`.
- **Control**: Solicita datos al `CalendarioController`.
- **Salida**: Navega hacia `:Collaboration` de Descarga o Incidencias, o retorna a `:Sistema Disponible`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Identificar al actor en sesión para aplicar filtros de visibilidad automáticos.
- Coordinar la recuperación de exámenes desde el repositorio basándose en rangos temporales o criterios de búsqueda.
- Proveer los datos necesarios para la representación del calendario.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ConsultarCalendarioView`.
- **Repositorio**: Utiliza `ExamenRepository`.
- **Sesión**: Consulta el contexto de usuario en `:Session`.

## clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Recuperar exámenes filtrados por rango de fechas y actor (Administrador: todos, Profesor: asignados, Alumno: matriculados).
- Implementar la lógica de búsqueda activa por criterios complejos (Grado, Asignatura, Fecha).

#### Calendario
**Estereotipo**: Entidad  
**Responsabilidades**:
- Agrupar la colección de exámenes programados.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular la información del evento académico (fecha, hora, aula).
- **Delegación**: Proporcionar nombres de asignatura, aula y profesores vinculados.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer la dimensión de filtrado por materia académica.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer la dimensión de filtrado por titulación académica.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El usuario selecciona consultar calendario desde su menú principal.
2. **Carga Inicial (Vista Temporal)**: La vista solicita al controlador los eventos para el rango visible (mensual, semanal o diario) mediante `listarCalendario(rango)`.
3. **Contextualización**: `CalendarioController` obtiene el actor desde la sesión para determinar la visibilidad.
4. **Consulta**: El controlador solicita al `ExamenRepository` los exámenes filtrados por el rango temporal y el perfil del actor.
5. **Filtrado Dimensional**: Si el usuario aplica filtros (por Grado o Asignatura), la vista invoca `filtrarCalendario(criterio)`, donde `criterio` encapsula los atributos académicos de búsqueda.
6. **Presentación**: La vista renderiza los eventos en la rejilla del calendario.
7. **Navegación**: El usuario puede optar por descargar el calendario, comunicar una incidencia o finalizar la consulta.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Muestra vista mensual/semanal/diaria|`ConsultarCalendarioView` / `CalendarioController`|`listarCalendario(rango)`|
|Muestra exámenes con fecha, hora y aula|`Examen`|Delegación de atributos|
|Filtrar por grado o asignatura|`ExamenRepository`|`buscarPorCriterio(criterio, actor)`|
|Personalizado por actor (Prof/Alu)|`CalendarioController`|Consulta a `:Session`|
|Descargar calendario / Incidencias|`ConsultarCalendarioView`|Invocación de `:Collaboration`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso (Administrador)](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Especificación detallada: Detalle de Casos de Uso (Profesor)](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/1-Profesor/README.md)
- [Especificación detallada: Detalle de Casos de Uso (Alumno)](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/2-Alumno/README.md)
