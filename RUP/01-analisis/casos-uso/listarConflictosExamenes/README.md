# IdSw 2 > listarConflictosExamenes > Análisis

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

Análisis de colaboración del caso de uso `listarConflictosExamenes()` mediante el patrón MVC. El objetivo es identificar las clases de análisis y responsabilidades necesarias para detectar, visualizar y resolver de forma proactiva las colisiones de programación (horarios, aulas, profesores y alumnos) en el calendario académico.

## diagrama de colaboración

<div align=center>

|![Análisis: listarConflictosExamenes()](/images/01-analisis/casos-uso/listarConflictosExamenes/listarConflictosExamenes-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/listarConflictosExamenes/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarConflictosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la lista consolidada de conflictos de programación al Administrador.
- Categorizar visualmente los tipos de conflicto: **Horario, Aula, Profesor y Alumnos con múltiples exámenes**.
- Proveer interfaces para la selección de una resolución específica para cada conflicto.
- Mostrar opciones de disponibilidad sugeridas por el sistema.
- Capturar las acciones de resolución (cambio de horario/aula) y gestionar la actualización del calendario.

**Colaboraciones**:
- **Entrada**: Recibe `listarConflictos()` desde `:Exámenes Abierto`.
- **Control**: Se comunica con `ExamenController` para obtener datos y aplicar resoluciones.
- **Salida**: Retorna a `:Exámenes Abierto`.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la detección masiva de conflictos mediante el repositorio.
- Orquestar la lógica de búsqueda de alternativas (disponibilidad) para resolver colisiones específicas.
- Validar que las resoluciones propuestas no generen nuevos conflictos.
- Aplicar los cambios de programación a las entidades `Examen` afectadas.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ListarConflictosView`.
- **Repositorio**: Utiliza `ExamenRepository` para la detección y actualización.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Ejecutar los algoritmos de detección de colisiones en la persistencia.
- Proveer métodos para buscar huecos de disponibilidad (aulas y horarios libres).
- Persistir los cambios en los exámenes resueltos.

#### Conflicto
**Estereotipo**: Entidad (Inventada mediante Indirección)  
**Responsabilidades**:
- **Contenedor Conceptual**: Agrupar los datos de una colisión específica (Tipo, Exámenes involucrados, Gravedad).
- Proporcionar información descriptiva del conflicto para la vista siguiendo la **Ley de Demeter**.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar los eventos programados que están en conflicto.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Exámenes Abierto` invoca `ListarConflictosView.listarConflictos()`.
2. **Detección**: La vista solicita `obtenerConflictos()` al controlador.
3. **Indirección Masiva**: El controlador utiliza `ExamenRepository.detectarConflictos()` para obtener una entidad conceptual `PagedResult<Conflicto>`.
4. **Análisis de Resolución**: El Administrador selecciona un conflicto; la vista solicita `obtenerOpcionesResolucion(conflicto)`.
5. **Búsqueda de Disponibilidad**: El controlador consulta al repositorio por aulas o franjas horarias libres que eliminen la colisión.
6. **Aplicación**: El Administrador selecciona una opción; la vista llama a `resolverConflicto(conflicto, resolucion)`.
7. **Sincronización**: El controlador actualiza el `Examen` involucrado y confirma la persistencia en el repositorio.
8. **Cierre**: Se refresca la lista de conflictos restantes y se permite cerrar la vista.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar conflictos (horario, aula, prof, alumno)|`ExamenRepository`|`detectarConflictos()`|
|Permitir resolver cada conflicto|`ListarConflictosView`|Interfaz de acción por fila|
|Presentar opciones de resolución|`ExamenController`|`obtenerOpcionesResolucion()`|
|Modificar horario o aula|`Examen`|`<<update>>` de atributos|
|Actualizar calendario y lista|`ExamenRepository`|`actualizar(examen)`|

## patrones aplicados

### indirección mediante entidades inventadas
Se utiliza la entidad `Conflicto` y `PagedResult<Conflicto>` para abstraer la complejidad de la detección y asegurar que el listado sea escalable, incluso si la generación automática genera cientos de alertas.

### law of demeter (delegación)
La entidad `Conflicto` encapsula la lógica de descripción de la colisión, evitando que la vista navegue por las relaciones de los exámenes en conflicto.

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirExamenes()](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)
