# IdSw 2 > completarProceso > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-01
- **Autor**: Gemini CLI

## propósito

Análisis de la transición de navegación `completarProceso()`. Este artefacto documenta el cierre formal del flujo de generación automática de calendarios y el retorno del sistema al estado estable `:Sistema Disponible`.

## diagrama de colaboración

<div align=center>

|![Análisis: completarProceso()](/images/01-analisis/casos-uso/completarProceso/completarProceso-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/completarProceso/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### GenerarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la finalización del proceso de generación por parte del Administrador.
- Iniciar la transición de retorno al menú principal tras el éxito de la operación.

**Colaboraciones**:
- **Entrada**: Recibe `completarProceso()` desde el estado `:Calendario Generado`.
- **Salida**: Navega hacia `MenuPrincipalView`.

#### MenuPrincipalView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Representar el estado estable `:Sistema Disponible`.

**Colaboraciones**:
- **Entrada**: Recibe la navegación desde la vista de generación.
- **Estado**: Confirma la transición al estado `:Sistema Disponible`.

## flujo de colaboración

### secuencia de operaciones

1. **Finalización**: El Administrador selecciona "Finalizar" tras la revisión de los resultados de la generación.
2. **Navegación**: `GenerarCalendarioView` transfiere el control a `MenuPrincipalView`.
3. **Estabilización**: El sistema regresa formalmente al estado `:Sistema Disponible`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Retorno al menú principal|`GenerarCalendarioView`|Transición `<<navegar>>`|
|Transición a SISTEMA_DISPONIBLE|`MenuPrincipalView`|Confirmación de estado|

## referencias

- [Diagrama de Contexto: Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
- [Análisis: generarCalendario()](/RUP/01-analisis/casos-uso/generarCalendario/README.md)
