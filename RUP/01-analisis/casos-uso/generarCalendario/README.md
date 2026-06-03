# IdSw 2 > generarCalendario > Análisis

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

Análisis de colaboración del caso de uso `generarCalendario()` mediante el patrón MVC. Este artefacto define el "motor" del sistema, orquestando la asignación automatizada de fechas, horas y aulas a los exámenes pendientes, cruzando las capacidades físicas de los espacios con las restricciones horarias del personal docente.

## diagrama de colaboración

<div align=center>

|![Análisis: generarCalendario()](/images/01-analisis/casos-uso/generarCalendario/generarCalendario-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/generarCalendario/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### GenerarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Proveer el formulario de configuración (fechas de inicio/fin, franjas horarias).
- Capturar la solicitud de generación del Administrador.
- Presentar el balance de la operación (`GeneracionResult`): número de exámenes programados y lista de conflictos.
- Facilitar la navegación hacia la revisión de conflictos y el guardado final del calendario.

**Colaboraciones**:
- **Entrada**: Recibe `generarCalendario()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Navega hacia `:Calendario Generado`, `:Collaboration ListarConflictos` o retorna a `:Sistema Disponible`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar el algoritmo de generación masiva de horarios.
- Coordinar la recuperación de exámenes pendientes y recursos físicos (aulas).
- Validar cada asignación contra las restricciones docentes (`PreferenciaRepository`).
- Actualizar el estado de los exámenes y el calendario global.
- Consolidar los resultados y conflictos en una entidad de retorno.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `GenerarCalendarioView`.
- **Repositorios**: Utiliza `ExamenRepository`, `AulaRepository` y `PreferenciaRepository`.
- **Entidades**: Manipula `Calendario` y `Examen`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Recuperar la colección de exámenes que aún no tienen programación.
- Persistir las actualizaciones de fecha, hora y aula en bloque (`guardarLote`).

#### AulaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Consultar la disponibilidad y capacidad de las aulas para franjas horarias específicas.

#### PreferenciaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer las restricciones horarias y de días de los profesores para evitar colisiones en la asignación.

#### Calendario
**Estereotipo**: Entidad  
**Responsabilidades**:
- Agrupar y mantener el estado global de la programación académica.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recibir y encapsular la asignación de recursos temporales y físicos.

#### GeneracionResult
**Estereotipo**: Entidad (Inventada)  
**Responsabilidades**:
- Encapsular el balance final del proceso: estadísticas de éxito y lista detallada de conflictos (colisiones insalvables).

## flujo de colaboración

### secuencia de operaciones

1. **Configuración**: El Administrador introduce el rango de fechas y franjas horarias en `GenerarCalendarioView`.
2. **Solicitud**: Se invoca `generar(inicio, fin, franjas)` en el `CalendarioController`.
3. **Carga de Datos**: El controlador recupera los exámenes pendientes desde `ExamenRepository`.
4. **Iteración y Asignación**: Para cada examen y franja horaria:
    - Se consulta la disponibilidad de aulas en `AulaRepository`.
    - Se validan las restricciones del profesor asignado en `PreferenciaRepository`.
5. **Cambio de Estado**: El controlador actualiza los objetos `Examen` con la programación exitosa (`<<update>>`).
6. **Sincronización**: Se persiste el lote de exámenes programados en el repositorio.
7. **Consolidación**: El controlador instancia `GeneracionResult` con el resumen del proceso.
8. **Feedback**: La vista muestra los resultados; el Administrador puede optar por revisar conflictos detalladamente o confirmar el guardado final para transitar a `:Calendario Generado`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir fechas inicio/fin y horarios|`GenerarCalendarioView`|Interfaz de configuración|
|Asignar exámenes a aulas disponibles|`AulaRepository`|`consultarDisponibilidad(franja)`|
|Asignar profesores a exámenes|`PreferenciaRepository`|`verificarRestriccionesDocentes(franja)`|
|Mostrar número de exámenes y conflictos|`GeneracionResult`|Objeto de balance|
|Solicitar revisar conflictos|`GenerarCalendarioView`|Enlace a `:Collaboration ListarConflictos`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: listarConflictosExamenes()](/RUP/01-analisis/casos-uso/listarConflictosExamenes/README.md)
