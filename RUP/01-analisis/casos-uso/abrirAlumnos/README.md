# IdSw 2 > abrirAlumnos > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-27
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `abrirAlumnos()` mediante el patrón MVC. Este artefacto define la estructura necesaria para listar, filtrar y navegar hacia la gestión de estudiantes, aplicando estrategias de **Indirección para Alto Volumen** (`PagedResult`) y el principio de delegación para la información académica vinculada (Grados).

## diagrama de colaboración

<div align=center>

|![Análisis: abrirAlumnos()](/images/01-analisis/casos-uso/abrirAlumnos/abrirAlumnos-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/abrirAlumnos/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarAlumnosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el listado de alumnos (matrícula, nombre, email, grado y curso).
- Proveer controles para la búsqueda filtrada y la navegación paginada.
- Facilitar el acceso a las colaboraciones de CRUD e importación masiva.

**Colaboraciones**:
- **Entrada**: Recibe `abrirAlumnos()` desde `:Sistema Disponible`.
- **Control**: Solicita datos paginados a `AlumnoController`.
- **Salida**: Navega hacia `:Collaboration` de Crear, Editar, Eliminar e Importar, o retorna a `:Sistema Disponible`.

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Mediar entre la vista y el repositorio para la recuperación de estudiantes.
- Orquestar la carga inicial paginada y la gestión de búsquedas filtradas.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ListarAlumnosView`.
- **Repositorio**: Utiliza `AlumnoRepository`.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer acceso eficiente al almacenamiento de alumnos.
- Implementar la lógica de búsqueda filtrada y paginada (`buscarPaginados`).

**Colaboraciones**:
- **Entidad**: Gestiona instancias de `Alumno`.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del estudiante.
- **Delegación**: Proporcionar información de su grado matriculado siguiendo la Ley de Demeter.

**Colaboraciones**:
- **Entidad**: Se asocia con `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la dependencia académica del alumno.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El Administrador selecciona gestionar alumnos en el menú principal.
2. **Carga**: `:Sistema Disponible` invoca `ListarAlumnosView.abrirAlumnos()`.
3. **Solicitud de Datos**: La vista solicita al controlador el bloque inicial: `listarAlumnos(pagina)`.
4. **Recuperación**: `AlumnoController` delega en `AlumnoRepository.obtenerPaginados(pagina)`.
5. **Filtrado**: Ante una búsqueda, la vista invoca `filtrarAlumnos(criterio, pagina)`, delegando en `AlumnoRepository.buscarPaginados(criterio, pagina)`.
6. **Presentación**: La vista renderiza el `PagedResult<Alumno>` y habilita la navegación y las colaboraciones externas.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar matrícula, nombre, email, grado y curso|`ListarAlumnosView`|Renderizado de atributos de `Alumno`|
|Presentar lista de alumnos|`AlumnoController`|`listarAlumnos(pagina)`|
|Permitir filtrar lista|`AlumnoController`|`filtrarAlumnos(criterio, pagina)`|
|Navegar a crear/editar/eliminar/importar|`ListarAlumnosView`|Invocación de `:Collaboration`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Diagrama de Contexto: Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
