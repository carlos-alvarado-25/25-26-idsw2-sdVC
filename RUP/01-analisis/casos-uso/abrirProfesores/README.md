# IdSw 2 > abrirProfesores > Análisis

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

Análisis de colaboración del caso de uso `abrirProfesores()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para gestionar el listado y acceso a las operaciones de los profesores académicos.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirProfesores()](/images/01-analisis/casos-uso/abrirProfesores/abrirProfesores-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/abrirProfesores/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarProfesoresView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de gestión de profesores al Administrador.
- Mostrar el listado paginado de profesores con sus datos clave (Código, Nombre, Email, Departamento).
- Capturar criterios de filtrado y búsqueda.
- Proveer puntos de acceso a las colaboraciones de creación, edición, eliminación e importación.
- Gestionar el retorno a la gestión general del sistema.

**Colaboraciones**:
- **Entrada**: Recibe `abrirProfesores()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Navega hacia `:Sistema Disponible` o colaboraciones CRUD/Importación.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la recuperación y filtrado del listado de profesores de forma paginada.
- Orquestar la lógica de negocio relacionada con la visualización de profesores.
- Servir de puente entre la vista y la persistencia de datos.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ListarProfesoresView`.
- **Repositorio**: Delega la obtención de datos paginados a `ProfesorRepository`.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el acceso a los datos de los profesores.
- Proporcionar métodos de consulta paginada (`obtenerPaginados`) y búsqueda filtrada con soporte para páginas (`buscarPaginados`).

**Colaboraciones**:
- **Control**: Responde a solicitudes de `ProfesorController`.
- **Entidad**: Gestiona instancias de `Profesor`.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un profesor académico (código, nombre, email, departamento).
- Mantener la relación con las asignaturas que imparte.
- **Delegación (Law of Demeter)**: Proporcionar la lista de nombres de las asignaturas vinculadas (ej. `getNombresAsignaturas()`) para su visualización plana, evitando el acoplamiento directo de la vista con la estructura de la colección de asignaturas.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la materia académica vinculada al profesor.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Sistema Disponible` invoca `ListarProfesoresView.abrirProfesores()`.
2. **Carga Inicial**: La vista solicita la primera página del listado al `ProfesorController` mediante `listarProfesores(pagina)`.
3. **Consulta**: El controlador recupera los datos paginados (`PagedResult<Profesor>`) desde `ProfesorRepository.obtenerPaginados(pagina)`.
4. **Presentación**: La vista renderiza la tabla de profesores para la página actual.
5. **Filtrado**: El Administrador introduce criterios de búsqueda; la vista solicita `filtrarProfesores(criterio, pagina)`, delegando en `ProfesorRepository.buscarPaginados(criterio, pagina)`.
6. **Navegación**: El usuario selecciona una acción (Crear/Editar/Eliminar/Importar) transfiriendo el control a la colaboración correspondiente.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de profesores|`ProfesorController`|`listarProfesores(pagina)`|
|Código, nombre, email, departamento|`Profesor`|Atributos de la entidad|
|Permitir filtrar lista|`ProfesorController`|`filtrarProfesores(criterio, pagina)`|
|Acciones CRUD / Importación|`ListarProfesoresView`|Puntos de navegación|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Diagrama de contexto - Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
