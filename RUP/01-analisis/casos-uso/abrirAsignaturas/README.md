# IdSw 2 > abrirAsignaturas > Análisis

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

Análisis de colaboración del caso de uso `abrirAsignaturas()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y las dependencias necesarias con la entidad `Grado` para gestionar el listado y acceso a las operaciones de las asignaturas académicas.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirAsignaturas()](/images/01-analisis/casos-uso/abrirAsignaturas/abrirAsignaturas-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/abrirAsignaturas/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarAsignaturasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de gestión de asignaturas al Administrador.
- Mostrar el listado paginado de asignaturas con sus datos clave (Código, Nombre, Créditos, Grado).
- Capturar criterios de filtrado y búsqueda.
- Proveer puntos de acceso a las colaboraciones de creación, edición, eliminación e importación.
- Gestionar el retorno a la gestión general del sistema.

**Colaboraciones**:
- **Entrada**: Recibe `abrirAsignaturas()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Navega hacia `:Sistema Disponible` o colaboraciones CRUD/Importación.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la recuperación y filtrado del listado de asignaturas de forma paginada.
- Orquestar la lógica de negocio relacionada con la visualización de asignaturas.
- Servir de puente entre la vista y la persistencia de datos.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ListarAsignaturasView`.
- **Repositorio**: Delega la obtención de datos paginados a `AsignaturaRepository`.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el acceso a los datos de las asignaturas.
- Proporcionar métodos de consulta paginada (`obtenerPaginadas`) y búsqueda filtrada con soporte para páginas (`buscarPaginadas`).

**Colaboraciones**:
- **Control**: Responde a solicitudes de `AsignaturaController`.
- **Entidad**: Gestiona instancias de `Asignatura`.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de una asignatura académica (código, nombre, créditos).
- Mantener la relación con el `Grado` al que pertenece.
- **Delegación (Law of Demeter)**: Proporcionar la información del grado asociado (ej. `getNombreGrado()`) a las capas superiores, evitando el encadenamiento de métodos (Train Wreck) en el controlador o la vista.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el grado académico asociado a la asignatura.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Sistema Disponible` invoca `ListarAsignaturasView.abrirAsignaturas()`.
2. **Carga Inicial**: La vista solicita la primera página del listado al `AsignaturaController`.
3. **Consulta**: El controlador recupera los datos paginados (`PagedResult<Asignatura>`) desde `AsignaturaRepository`.
4. **Presentación**: La vista renderiza la tabla de asignaturas para la página actual.
5. **Filtrado / Navegación de Páginas**: El Administrador introduce criterios o cambia de página; la vista solicita actualización al controlador.
6. **Navegación**: El usuario selecciona una acción (Crear/Editar/Eliminar/Importar) transfiriendo el control a la colaboración correspondiente.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de asignaturas|`ListarAsignaturasView`|`listarAsignaturas(filtros, pagina)`|
|Código, nombre, créditos, grado|`Asignatura` / `Grado`|Atributos de las entidades|
|Permitir filtrar lista|`AsignaturaController`|`filtrarAsignaturas(criterio, pagina)`|
|Acciones CRUD / Importación|`ListarAsignaturasView`|Puntos de navegación|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Diagrama de contexto - Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
