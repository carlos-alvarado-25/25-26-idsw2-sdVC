# IdSw 2 > cerrarSesion > Diseño

> |[🏠️](/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/cerrarSesion/README.md)|**Diseño**|[Desarrollo](/RUP/03-desarrollo/casos-uso/cerrarSesion/README.md)|Pruebas|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso cerrarSesion para la plataforma NestJS + Angular. Este diseño especifica el protocolo de desconexión segura, invalidando el contexto de seguridad tanto en el servidor como en el cliente.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: cerrarSesion()](/images/02-diseño/casos-uso/cerrarSesion/cerrarSesion-secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/cerrarSesion/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| MenuPrincipalView | MenuPrincipalComponent (Angular) | - |
| AuthController | - | AuthController (NestJS) |
| - | - | AuthService (NestJS) |
| :Session | SessionService (Angular) | AuthService (JWT/Cookie) |

## Detalles Técnicos

### 1. Comunicación API
- **Endpoint**: `POST /auth/logout`
- **Respuesta Exitosa**: `200 OK`. El servidor instruye al cliente para que descarte cualquier identificador de sesión.

### 2. Gestión de Estado Local
- El `SessionService` en Angular es responsable de limpiar el `localStorage` y resetear el estado de los componentes dependientes del usuario autenticado.

## Referencias

- [Análisis: cerrarSesion](/RUP/01-analisis/casos-uso/cerrarSesion/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
