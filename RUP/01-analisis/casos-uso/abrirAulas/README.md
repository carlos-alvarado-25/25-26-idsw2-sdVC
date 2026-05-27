# IdSw 2 > abrirAulas > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-05-27
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `abrirAulas()` mediante el patrón MVC. Este artefacto define la estructura necesaria para listar, filtrar y navegar hacia la gestión de espacios físicos (aulas), tratándola como una entidad de bajo volumen de datos.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirAulas()](/images/01-analisis/casos-uso/abrirAulas/abrirAulas-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/abrirAulas/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarAulasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el listado completo de aulas (código, nombre, capacidad, edificio, planta, tipo).
- Proveer controles para el filtrado de la lista en memoria o mediante consulta simple.
- Facilitar el acceso a las colaboraciones de CRUD e importación masiva.

**Colaboraciones**:
- **Entrada**: Recibe `abrirAulas()` desde `:Sistema Disponible`.
- **Control**: Solicita datos a `AulaController`.
- **Salida**: Navega hacia `:Collaboration` de Crear, Editar, Eliminar e Importar, o retorna a `:Sistema Disponible`.

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Mediar entre la vista y el repositorio para la recuperación de datos.
- Aplicar criterios de búsqueda simples.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ListarAulasView`.
- **Repositorio**: Utiliza `AulaRepository`.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer acceso al almacenamiento de aulas.
- Recuperar la colección completa o filtrada de aulas (`obtenerTodas`, `buscarPorCriterio`).

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los atributos del espacio físico (capacidad, ubicación geográfica interna).

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El Administrador selecciona gestionar aulas en el menú principal.
2. **Carga**: `:Sistema Disponible` invoca `ListarAulasView.abrirAulas()`.
3. **Solicitud de Datos**: La vista solicita al controlador el listado de aulas: `listarAulas()`.
4. **Recuperación**: `AulaController` delega en `AulaRepository.obtenerTodas()`.
5. **Presentación**: La vista renderiza la `List<Aula>`.
6. **Navegación**: El Administrador puede elegir entre filtrar la lista o invocar una de las colaboraciones externas (Crear, Editar, Eliminar, Importar) para completar la gestión.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar código, nombre, capacidad, edificio, planta, tipo|`ListarAulasView`|Renderizado de atributos de `Aula`|
|Permitir filtrar lista|`AulaController`|`filtrarAulas(criterio)`|
|Navegar a crear/editar/eliminar/importar|`ListarAulasView`|Invocación de `:Collaboration`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Diagrama de Contexto: Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
