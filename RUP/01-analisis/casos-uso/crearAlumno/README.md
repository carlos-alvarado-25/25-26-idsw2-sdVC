# IdSw 2 > crearAlumno > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|[📂 Diseño](/RUP/02-diseño/casos-uso/crearAlumno/README.md)|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/crearAlumno/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `crearAlumno()` mediante el patrón MVC. Este artefacto define el flujo para el alta manual de estudiantes, aplicando la estrategia "El Delgado" que permite una captura rápida de datos esenciales y una transición inmediata al estado de edición detallada.

## diagrama de colaboración

<div align=center>

|![Análisis: crearAlumno()](/images/01-analisis/casos-uso/crearAlumno/crearAlumno-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/crearAlumno/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearAlumnoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de captura minimalista (Matrícula, Nombre, Email, Curso, Grado).
- Proveer una interfaz de selección para la asignación de Grado.
- Capturar los datos introducidos por el Administrador.
- Gestionar las acciones de guardado y cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `crearAlumno()` desde `:Alumnos Abierto`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: Navega hacia `:Alumno Abierta` (vía `editarAlumno()`) tras el éxito o retorna a `:Alumnos Abierto` tras cancelar.

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar la creación del nuevo perfil de estudiante.
- Validar la unicidad de la matrícula mediante el repositorio.
- Proveer la lista de grados disponibles para la asociación académica.
- Instanciar la entidad `Alumno` y coordinar su persistencia.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `CrearAlumnoView`.
- **Repositorio**: Utiliza `AlumnoRepository`, `GradoRepository` y `UsuarioRepository`.
- **Transacción**: Orquesta la creación atómica de `Usuario` y `Alumno` dentro de una única transacción de base de datos.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Verificar la existencia de matrículas en el sistema (`existeMatricula`).
- Persistir la nueva instancia de la entidad `Alumno`.

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proporcionar la colección de grados académicos disponibles para su selección.

#### UsuarioRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Verificar la existencia del email en el sistema.
- Persistir las credenciales de acceso vinculadas (`Usuario`).

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular el estado inicial del estudiante recién creado, enlazado a su `Usuario`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la dependencia académica del alumno.

#### Usuario
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar las credenciales y rol (`Alumno`) de acceso al sistema del estudiante.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El Administrador solicita crear un alumno desde el listado general.
2. **Carga**: `:Alumnos Abierto` invoca `CrearAlumnoView.crearAlumno()`.
3. **Carga de Contexto**: La vista solicita al controlador los grados disponibles: `obtenerGradosDisponibles()`.
4. **Entrada de Datos**: El Administrador completa los campos (Matrícula, Nombre, Email, Curso, Grado) y solicita **Guardar**.
5. **Validación de Matrícula**: `AlumnoController` verifica que la matrícula sea única mediante `AlumnoRepository.existeMatricula()`.
6. **Transacción Atómica**: `AlumnoController` abre una transacción de base de datos que incluye:
    - **Creación de Credencial**: Verifica si el `Usuario` con ese email ya existe. Si no, lo crea con contraseña predeterminada (`idsw2_2026`, cifrada con bcrypt) y rol `Alumno`.
    - **Creación de Perfil**: Instancia `Alumno` vinculando el `usuarioId` del usuario y lo persiste mediante `AlumnoRepository.guardar()`.
    - Si cualquier paso falla, la transacción entera se revierte (atomicidad garantizada).
7. **Transición**: Tras el éxito, se transita automáticamente al estado de edición singular `:Alumno Abierta` invocando `editarAlumno(alumno)`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir matrícula, nombre, email, curso|`CrearAlumnoView`|Formulario de entrada|
|Seleccionar grado disponible|`GradoRepository`|`obtenerTodos()`|
|Verificar matrícula única|`AlumnoController`|`AlumnoRepository.existeMatricula()`|
|Generar credencial de acceso asociada (`idsw2_2026`)|`UsuarioRepository`|`crearUsuario(email, password, rol)`|
|Guardar nuevo alumno en base de datos|`AlumnoRepository`|`guardar(alumno)`|
|Garantizar atomicidad de la operación|`AlumnoController`|Transacción `manager.transaction()`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAlumnos()](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)
