# IdSw 2 > crearProfesor > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-26
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `crearProfesor()` mediante el patrón MVC, identificando las clases de análisis, responsabilidades y validaciones críticas (email único) necesarias para el alta manual de docentes en el sistema.

## diagrama de colaboración

<div align=center>

|![Análisis: crearProfesor()](/images/01-analisis/casos-uso/crearProfesor/crearProfesor-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/crearProfesor/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de profesor (Código, Nombre, Email, Departamento).
- Solicitar y mostrar la guía de departamentos disponibles al usuario.
- Capturar la entrada del Administrador y gestionar las acciones de guardado y cancelación.
- Notificar el éxito de la creación y redirigir a la edición completa para la asignación de materias.

**Colaboraciones**:
- **Entrada**: Recibe `crearProfesor()` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Navega hacia `:Profesor Abierto` (Edición) o `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Proporcionar el listado de departamentos válidos para el formulario.
- Coordinar el flujo de creación del perfil docente.
- Validar la unicidad del email mediante consulta al repositorio.
- Orquestar la instanciación de `Profesor` y su persistencia inicial.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `CrearProfesorView`.
- **Repositorio**: Utiliza `ProfesorRepository`.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Gestionar la persistencia de los perfiles docentes.
- Verificar la existencia de emails en el sistema (`existeEmail`).

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar los datos básicos de un docente y asegurar la integridad de su estado interno.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Profesores Abierto` invoca `CrearProfesorView.crearProfesor()`.
2. **Guía de Usuario**: La vista solicita `obtenerDepartamentosDisponibles()` al controlador para poblar el selector.
3. **Captura**: El Administrador introduce los datos (código, nombre, email, departamento) y solicita guardar.
4. **Validación de Identidad**: `ProfesorController` verifica mediante el repositorio que el email no esté registrado previamente.
5. **Instanciación**: `ProfesorController` crea la instancia de `Profesor` con los datos validados.
6. **Persistencia**: Se delega el guardado a `ProfesorRepository.guardar(profesor)`.
7. **Transición**: Se redirige automáticamente a `editarProfesor()` para permitir la asignación de asignaturas al nuevo docente.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir código, nombre, email y departamento|`CrearProfesorView`|Captura de formulario|
|Muestra departamentos disponibles|`ProfesorController`|`obtenerDepartamentosDisponibles()`|
|Validar email único|`ProfesorRepository`|`existeEmail(email)`|
|Guardar nuevo profesor en base de datos|`ProfesorRepository`|`guardar(profesor)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirProfesores()](/RUP/01-analisis/casos-uso/abrirProfesores/README.md)
