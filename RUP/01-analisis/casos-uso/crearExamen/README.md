# IdSw 2 > crearExamen > Análisis

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

Análisis de colaboración del caso de uso `crearExamen()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y las dependencias necesarias con la entidad `Asignatura` para la creación de nuevos exámenes programados.

## diagrama de colaboración

<div align=center>

|![Análisis: crearExamen()](/images/01-analisis/casos-uso/crearExamen/crearExamen-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/crearExamen/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearExamenView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de examen (Código, Fecha, Duración).
- Mostrar la lista de asignaturas disponibles para su selección.
- Capturar la entrada del Administrador y gestionar las acciones de guardado y cancelación.
- Notificar el éxito de la creación y redirigir a la edición completa.

**Colaboraciones**:
- **Entrada**: Recibe `crearExamen()` desde `:Exámenes Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Navega hacia `:Examen Abierto` (Edición) o `:Exámenes Abierto`.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Proporcionar el listado de asignaturas válidas para el formulario.
- Coordinar el flujo de creación del examen.
- Validar la integridad de los datos y la unicidad del código.
- Orquestar la instanciación y persistencia de la entidad.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `CrearExamenView`.
- **Repositorio**: Utiliza `ExamenRepository` y `AsignaturaRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Gestionar la persistencia de los exámenes en el almacenamiento permanente.
- Verificar la existencia de exámenes por código.

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer la lista de asignaturas activas en el sistema para la selección en el formulario.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar un examen programado y sus atributos básicos.

## flujo de colaboración

### secuencia de operaciones

1. **Carga de Formulario**: `:Exámenes Abierto` invoca `CrearExamenView.crearExamen()`.
2. **Búsqueda de Dependencias**: La vista permite buscar la asignatura; solicita `buscarAsignaturas(criterio, pagina)` al controlador.
3. **Consulta Paginada**: El controlador recupera las asignaturas filtradas desde `AsignaturaRepository` usando la entidad conceptual `PagedResult`.
4. **Selección**: El Administrador selecciona la asignatura del resultado paginado, introduce fecha/hora y solicita guardar.
5. **Validación y Creación**: `ExamenController` verifica unicidad y crea la instancia de `Examen`.
6. **Persistencia**: Se delega el guardado a `ExamenRepository`.
7. **Transición**: Se redirige automáticamente a `editarExamen()` para completar la programación.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir código, fecha, hora y duración|`CrearExamenView`|Captura de formulario|
|Seleccionar asignatura|`AsignaturaRepository`|`buscarPaginadas(criterio, pagina)`|
|Validar campos requeridos|`ExamenController`|Lógica de creación|
|Persistir en base de datos|`ExamenRepository`|`guardar(examen)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirExamenes()](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)
