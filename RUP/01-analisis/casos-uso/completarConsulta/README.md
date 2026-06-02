# IdSw 2 > completarConsulta > Análisis

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

Análisis de la transición de navegación `completarConsulta()`. Este artefacto documenta el cierre de la vista de consulta del calendario por parte de cualquier actor (Administrador, Profesor o Alumno) y el retorno del sistema al estado estable `:Sistema Disponible`.

## diagrama de colaboración

<div align=center>

|![Análisis: completarConsulta()](/images/01-analisis/casos-uso/completarConsulta/completarConsulta-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/completarConsulta/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ConsultarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la solicitud de finalización de consulta del calendario.
- Iniciar la transición de retorno al menú principal.

**Colaboraciones**:
- **Entrada**: Recibe `completarConsulta()` desde el estado `:Calendario Abierto`.
- **Salida**: Navega hacia `MenuPrincipalView`.

#### MenuPrincipalView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Representar el estado estable `:Sistema Disponible`.

**Colaboraciones**:
- **Entrada**: Recibe la navegación desde la vista de consulta.
- **Estado**: Confirma la transición al estado `:Sistema Disponible`.

## flujo de colaboración

### secuencia de operaciones

1. **Finalización**: El usuario selecciona "Cerrar" o "Regresar" tras finalizar la revisión del calendario.
2. **Navegación**: `ConsultarCalendarioView` transfiere el control a `MenuPrincipalView`.
3. **Estabilización**: El sistema regresa al estado estable `:Sistema Disponible`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Retorno al menú principal|`ConsultarCalendarioView`|Transición `<<navegar>>`|
|Transición a SISTEMA_DISPONIBLE|`MenuPrincipalView`|Confirmación de estado|

## referencias

- [Diagrama de Contexto: Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
- [Análisis: consultarCalendario()](/RUP/01-analisis/casos-uso/consultarCalendario/README.md)
