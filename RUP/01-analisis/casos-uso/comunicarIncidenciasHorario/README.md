# IdSw 2 > comunicarIncidenciasHorario > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `comunicarIncidenciasHorario()` mediante el patrón MVC. Este artefacto define el proceso por el cual un Profesor reporta problemas o conflictos en la programación de sus exámenes, asegurando la trazabilidad de las incidencias y la notificación al Administrador.

## diagrama de colaboración

<div align=center>

|![Análisis: comunicarIncidenciasHorario()](/images/01-analisis/casos-uso/comunicarIncidenciasHorario/comunicarIncidenciasHorario-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/comunicarIncidenciasHorario/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ComunicarIncidenciaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de reporte de incidencias al Profesor.
- Facilitar la selección de un examen asignado al docente.
- Capturar la descripción, tipo de incidencia y evidencias adjuntas.
- Gestionar el envío del reporte y la navegación de retorno.

**Colaboraciones**:
- **Entrada**: Recibe `comunicarIncidenciasHorario()` desde `:Sistema Disponible`.
- **Control**: Solicita datos y envía reportes a `IncidenciaController`.
- **Salida**: Navega hacia `:Sistema Disponible` vía `completarComunicacion()`.

### clases de control

#### IncidenciaController
**Estereotipo**: Control  
**Responsabilidades**:
- Identificar al profesor en sesión mediante el componente `:Session`.
- Recuperar la lista de exámenes asignados al docente para su selección.
- Orquestar el registro y persistencia de la incidencia.
- Validar la integridad de los datos del reporte.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ComunicarIncidenciaView`.
- **Repositorio**: Utiliza `IncidenciaRepository` y `ExamenRepository`.
- **Sesión**: Consulta el contexto en `:Session`.

### clases de entidad (entity)

#### IncidenciaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Persistir los reportes de incidencia generados por los profesores.

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer la colección de exámenes vinculados a un profesor específico.

#### Incidencia
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del reporte (tipo, descripción, fecha de registro).
- Mantener la asociación con el examen afectado.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer sus datos identificativos para el contexto del reporte.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: El Profesor selecciona reportar incidencia. El sistema invoca `ComunicarIncidenciaView.comunicarIncidenciasHorario()`.
2. **Contexto**: La vista solicita los exámenes disponibles: `obtenerExamenesDocente()`.
3. **Identificación**: El controlador obtiene el ID del profesor desde `:Session` y recupera sus exámenes desde `ExamenRepository`.
4. **Captura**: El Profesor selecciona el examen, describe el problema y adjunta evidencias.
5. **Registro**: Se solicita `comunicar(...)` al controlador, quien instancía la `Incidencia` y la persiste en `IncidenciaRepository`.
6. **Confirmación**: El sistema confirma el envío y habilita la transición de retorno al menú principal.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar examen con incidencia|`ExamenRepository`|`obtenerAsignadosA(profesor)`|
|Describir tipo e incidencia|`ComunicarIncidenciaView`|Formulario de entrada|
|Enviar reporte y notificar|`IncidenciaController`|`comunicar()`|
|Retorno al menú principal|`ComunicarIncidenciaView`|`completarComunicacion()`|

## referencias

- [Especificación detallada: Profesor](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/1-Profesor/README.md)
- [Diagrama de Contexto: Profesor](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
