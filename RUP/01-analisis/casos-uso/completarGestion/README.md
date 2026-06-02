# IdSw 2 > completarGestion > Análisis

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

Análisis de la transición de navegación `completarGestion()`. Este artefacto documenta el cierre formal de un ciclo de gestión de entidades y el retorno del sistema al estado estable `:Sistema Disponible`, asegurando la integridad del flujo operativo del Administrador.

## diagrama de colaboración

<div align=center>

|![Análisis: completarGestion()](/images/01-analisis/casos-uso/completarGestion/completarGestion-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/completarGestion/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### Listar[Entidad]View
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la intención de salida del usuario desde cualquier hub de listado.
- Iniciar la transición de navegación hacia el menú principal.

**Colaboraciones**:
- **Entrada**: Recibe `completarGestion()` desde el estado `:Entidades Abierto`.
- **Salida**: Navega hacia `MenuPrincipalView`.

#### MenuPrincipalView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Representar el estado estable `:Sistema Disponible`.
- Facilitar el acceso a todas las ramas funcionales del sistema.

**Colaboraciones**:
- **Entrada**: Recibe la navegación desde las vistas de listado.
- **Estado**: Confirma la transición al estado `:Sistema Disponible`.

## flujo de colaboración

### secuencia de operaciones

1. **Intención**: El Administrador selecciona la opción de "Regresar" o "Cerrar" en la vista de listado.
2. **Navegación**: `Listar[Entidad]View` transfiere el control a `MenuPrincipalView`.
3. **Estabilización**: El sistema entra formalmente en el estado `:Sistema Disponible`, mostrando el menú principal de opciones.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Retorno al menú principal|`Listar[Entidad]View`|Transición `<<navegar>>`|
|Transición a SISTEMA_DISPONIBLE|`MenuPrincipalView`|Confirmación de estado|

## referencias

- [Diagrama de Contexto: Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
