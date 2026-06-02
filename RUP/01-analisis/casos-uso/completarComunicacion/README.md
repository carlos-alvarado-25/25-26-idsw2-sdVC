# IdSw 2 > completarComunicacion > Análisis

> |[🏠️](/README.md)|[ 依](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## propósito

Análisis de la transición de navegación `completarComunicacion()`. Este artefacto documenta el cierre formal del flujo de reporte de incidencias por parte del Profesor y el retorno del sistema al estado estable `:Sistema Disponible`, asegurando la coherencia del ciclo de comunicación docente.

## diagrama de colaboración

<div align=center>

|![Análisis: completarComunicacion()](/images/01-analisis/casos-uso/completarComunicacion/completarComunicacion-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/completarComunicacion/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ComunicarIncidenciaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la intención de finalización del reporte por parte del Profesor.
- Iniciar la transición de retorno hacia el menú principal.

**Colaboraciones**:
- **Entrada**: Recibe `completarComunicacion()` desde el estado `:Incidencias Abierto`.
- **Salida**: Navega hacia `MenuPrincipalView`.

#### MenuPrincipalView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Representar el estado estable `:Sistema Disponible` para el actor Profesor.

**Colaboraciones**:
- **Entrada**: Recibe la navegación desde la vista de incidencias.
- **Estado**: Confirma la transición al estado `:Sistema Disponible`.

## flujo de colaboración

### secuencia de operaciones

1. **Finalización**: El Profesor selecciona "Finalizar" o "Regresar" tras completar el reporte de incidencia.
2. **Navegación**: `ComunicarIncidenciaView` transfiere el control a `MenuPrincipalView`.
3. **Estabilización**: El sistema regresa formalmente al estado estable `:Sistema Disponible`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Retorno al menú principal|`ComunicarIncidenciaView`|Transición `<<navegar>>`|
|Transición a SISTEMA_DISPONIBLE|`MenuPrincipalView`|Confirmación de estado|

## referencias

- [Diagrama de Contexto: Profesor](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
- [Análisis: comunicarIncidenciasHorario()](/RUP/01-analisis/casos-uso/comunicarIncidenciasHorario/README.md)
