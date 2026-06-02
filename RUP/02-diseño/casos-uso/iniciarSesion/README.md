# IdSw 2 > iniciarSesion > Diseño

> |[🏠️](/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/iniciarSesion/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|

## Información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso iniciarSesion para la plataforma NestJS + Angular. Este diseño especifica la interacción entre los componentes del frontend y las capas del backend para validar la identidad del usuario y establecer una sesión segura.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: iniciarSesion()](/images/02-diseño/casos-uso/iniciarSesion/iniciarSesion-secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/iniciarSesion/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| LoginView | LoginComponent (Angular) | - |
| AuthController | - | AuthController (NestJS) |
| - | - | AuthService (NestJS) |
| UsuarioRepository | - | UsuarioRepository (TypeORM) |
| :Session | SessionService (Local) | AuthService (JWT/Cookie) |

## Detalles Técnicos

### 1. Comunicación API
- **Endpoint**: `POST /auth/login`
- **Cuerpo (Request)**: `LoginDto` { email, password }
- **Respuesta Exitosa**: `200 OK` + `AuthResponseDto` (incluye token y datos básicos del perfil).
- **Respuesta Error**: `401 Unauthorized` si las credenciales son incorrectas.

### 2. Seguridad
- La contraseña se almacena y compara mediante técnicas de hashing (ej. bcrypt).
- El sistema utiliza la inyección de dependencias nativa de NestJS para comunicar el controlador con el servicio de autenticación.

## Referencias

- [Análisis: iniciarSesion](/RUP/01-analisis/casos-uso/iniciarSesion/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
