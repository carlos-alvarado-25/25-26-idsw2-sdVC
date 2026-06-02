# IdSw 2 > cerrarSesion > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/cerrarSesion/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/cerrarSesion/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-01
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `cerrarSesion()` mediante el patrón MVC. Este artefacto define el proceso de finalización de la sesión de usuario, garantizando la invalidación del contexto de seguridad y el retorno del sistema al estado estable `:Sesión Cerrada`.

## diagrama de colaboración

<div align=center>

|![Análisis: cerrarSesion()](/images/01-analisis/casos-uso/cerrarSesion/cerrarSesion-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/cerrarSesion/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### MenuPrincipalView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la solicitud de cierre de sesión por parte del usuario autenticado.
- Iniciar la transición de retorno hacia la pantalla de acceso.

**Colaboraciones**:
- **Entrada**: Recibe `cerrarSesion()` desde el estado `:Sistema Disponible`.
- **Control**: Solicita la desconexión al `AuthController`.
- **Salida**: Navega hacia `LoginView`.

### clases de control

#### AuthController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el protocolo de finalización de sesión.
- Ordenar la destrucción del contexto de seguridad en el componente `:Session`.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `MenuPrincipalView`.
- **Componente**: Invalida el componente `:Session`.

### clases de entidad (entity)

#### :Session
**Estereotipo**: Entidad (Componente de Sesión)  
**Responsabilidades**:
- Liberar los datos del usuario activo y anular el contexto de autenticación.

## flujo de colaboración

### secuencia de operaciones

1. **Intención**: El usuario selecciona la opción "Cerrar Sesión" desde el menú principal.
2. **Solicitud**: `MenuPrincipalView` solicita al `AuthController` la desconexión.
3. **Destrucción**: El controlador invoca `Session.destruir()`, eliminando los datos del usuario de la memoria activa.
4. **Navegación**: La vista redirige al usuario a la pantalla de acceso (`LoginView`).
5. **Estabilización**: El sistema regresa formalmente al estado estable `:Sesión Cerrada`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Cerrar sesión activa|`MenuPrincipalView`|Interfaz de salida|
|Invalidar contexto de seguridad|`AuthController`|`Session.destruir()`|
|Retorno a la pantalla de acceso|`MenuPrincipalView`|Transición a SESIÓN_CERRADA|

## referencias

- [Diagrama de Contexto: Comunes](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
- [Especificación detallada: cerrarSesion()](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/3-CasosDeUsoComunes/README.md)
