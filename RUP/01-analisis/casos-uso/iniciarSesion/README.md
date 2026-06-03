# IdSw 2 > iniciarSesion > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|[📂 Diseño](/RUP/02-diseño/casos-uso/iniciarSesion/README.md)|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/iniciarSesion/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-01
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `iniciarSesion()` mediante el patrón MVC. Este artefacto define el proceso de autenticación de los diferentes actores del sistema (Administrador, Profesor, Alumno), garantizando la validación de credenciales y la creación de una sesión de usuario válida para el acceso a las funcionalidades del sistema.

## diagrama de colaboración

<div align=center>

|![Análisis: iniciarSesion()](/images/01-analisis/casos-uso/iniciarSesion/iniciarSesion-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/iniciarSesion/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### LoginView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Proveer el formulario de captura de credenciales (Email/Usuario y Contraseña).
- Capturar la solicitud de acceso del usuario.
- Notificar errores de autenticación (credenciales inválidas).

**Colaboraciones**:
- **Entrada**: Recibe `iniciarSesion()` desde el estado `:Sesión Cerrada`.
- **Control**: Envía credenciales al `AuthController`.
- **Salida**: Navega hacia `MenuPrincipalView` tras el éxito.

### clases de control

#### AuthController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar el protocolo de autenticación del sistema.
- Coordinar la validación de credenciales con el repositorio de usuarios.
- Gestionar el ciclo de vida de la sesión activa mediante el componente `:Session`.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `LoginView`.
- **Repositorio**: Utiliza `UsuarioRepository`.
- **Componente**: Inicializa el componente `:Session`.

### clases de entidad (entity)

#### UsuarioRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Validar la existencia de la cuenta de usuario y la veracidad de la contraseña (`validarCredenciales`).
- Recuperar el perfil del usuario autenticado.

#### :Session
**Estereotipo**: Entidad (Componente de Sesión)  
**Responsabilidades**:
- Mantener en memoria la identidad y el perfil del usuario autenticado durante la ejecución del sistema.
- Proveer el contexto de seguridad para el resto de los controladores.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El sistema se presenta en la pantalla de acceso (`LoginView`).
2. **Entrada de Datos**: El usuario introduce su email y contraseña y solicita **Entrar**.
3. **Validación**: `AuthController` solicita la validación al `UsuarioRepository`.
4. **Identificación**: Si las credenciales son válidas, el controlador recupera la entidad `Usuario`.
5. **Sesión**: El controlador invoca `Session.crear(usuario)`, estableciendo el contexto activo.
6. **Acceso**: La vista redirige al Administrador/Profesor/Alumno a su respectivo `MenuPrincipalView`, entrando en el estado `:Sistema Disponible`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir credenciales|`LoginView`|Formulario de entrada|
|Validar identidad|`UsuarioRepository`|`validarCredenciales()`|
|Establecer sesión activa|`AuthController`|`Session.crear()`|
|Acceso al menú principal|`LoginView`|Transición a SISTEMA_DISPONIBLE|

## referencias

- [Diagrama de Contexto: Comunes](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
- [Especificación detallada: iniciarSesion()](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/3-CasosDeUsoComunes/README.md)
