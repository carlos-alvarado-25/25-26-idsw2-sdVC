# IdSw 2 > abrirExamenes > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-24
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `abrirExamenes()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para gestionar el listado y acceso a las operaciones de los exámenes académicos.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirExamenes()](/images/01-analisis/casos-uso/abrirExamenes/abrirExamenes-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/abrirExamenes/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarExamenesView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de gestión de exámenes al Administrador.
- Mostrar el listado de exámenes con sus datos clave (Asignatura, Fecha, Aula, Profesor).
- Capturar criterios de filtrado y búsqueda.
- Proveer puntos de acceso a las colaboraciones de creación, edición y eliminación.
- Gestionar el retorno a la gestión general del sistema.

**Colaboraciones**:
- **Entrada**: Recibe `abrirExamenes()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Navega hacia `:Sistema Disponible` o colaboraciones CRUD.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la recuperación y filtrado del listado de exámenes de forma paginada.
- Orquestar la lógica de negocio relacionada con la visualización de exámenes.
- Servir de puente entre la vista y la persistencia de datos.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ListarExamenesView`.
- **Repositorio**: Delega la obtención de datos paginados a `ExamenRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el acceso a los datos de los exámenes.
- Proporcionar métodos de consulta paginada (`obtenerPaginados`) y búsqueda filtrada con soporte para páginas (`buscarPaginados`).

**Colaboraciones**:
- **Control**: Responde a solicitudes de `ExamenController`.
- **Entidad**: Gestiona instancias de `Examen`.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un examen académico (fecha, hora, tipo).
- Mantener las relaciones con Asignatura, Aula y Profesor (vía IDs o referencias).

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Sistema Disponible` invoca `ListarExamenesView.abrirExamenes()`.
2. **Carga Inicial**: La vista solicita la primera página del listado al `ExamenController` mediante `listarExamenes(pagina)`.
3. **Consulta**: El controlador recupera los datos paginados (`PagedResult<Examen>`) desde `ExamenRepository.obtenerPaginados(pagina)`.
4. **Presentación**: La vista renderiza la tabla de exámenes programados para la página actual.
5. **Filtrado**: El Administrador introduce criterios; la vista invoca `filtrarExamenes(criterio, pagina)`, delegando en `ExamenRepository.buscarPaginados(criterio, pagina)`.
6. **Navegación**: El usuario selecciona una acción (Crear/Editar/Eliminar) transfiriendo el control a la colaboración correspondiente.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de exámenes|`ExamenController`|`listarExamenes(pagina)`|
|Mostrar Asignatura, Fecha, Aula, Profesor|`Examen`|Atributos de la entidad|
|Permitir filtrar lista|`ExamenController`|`filtrarExamenes(criterio, pagina)`|
|Accesos CRUD|`ListarExamenesView`|Enlaces de navegación|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Diagrama de contexto - Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
