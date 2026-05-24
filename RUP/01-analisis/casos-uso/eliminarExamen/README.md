# IdSw 2 > eliminarExamen > Análisis

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

Análisis de colaboración del caso de uso `eliminarExamen()` mediante el patrón MVC, identificando las clases de análisis y responsabilidades necesarias para la eliminación de exámenes programados del sistema, asegurando que el usuario visualice todos los datos críticos antes de confirmar.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarExamen()](/images/01-analisis/casos-uso/eliminarExamen/eliminarExamen-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/eliminarExamen/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarExamenView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el diálogo de confirmación de eliminación al Administrador.
- Mostrar los detalles completos del examen: **Asignatura, Fecha/Hora programada, Aula y Profesor responsable**.
- Capturar la confirmación o cancelación de la operación.
- Notificar el éxito de la eliminación.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarExamen(examen)` desde `:Exámenes Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Retorna a `:Exámenes Abierto`.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de eliminación del examen.
- Delegar la persistencia de la eliminación al repositorio.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EliminarExamenView`.
- **Repositorio**: Utiliza `ExamenRepository` para la eliminación física.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Eliminar el registro del examen del almacenamiento permanente.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el examen a ser eliminado, manteniendo sus asociaciones con Asignatura, Aula y Profesor.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Exámenes Abierto` invoca `EliminarExamenView.eliminarExamen(examen)`.
2. **Confirmación**: La vista presenta los datos completos del examen (**Materia, Horario, Aula y Docente**); el Administrador confirma la acción.
3. **Ejecución**: `EliminarExamenView` → `ExamenController.eliminar(examen)`.
4. **Persistencia**: `ExamenController` → `ExamenRepository.eliminar(examen)`.
5. **Cierre**: Se informa el éxito y se refresca el listado general en `:Exámenes Abierto`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar confirmación de eliminación|`EliminarExamenView`|Interfaz de confirmación|
|Mostrar datos (Asignatura, Fecha, Aula, Profesor)|`EliminarExamenView`|Renderizado de detalles completos|
|Eliminar examen de la base de datos|`ExamenRepository`|`eliminar(examen)`|
|Actualizar lista de exámenes|`EliminarExamenView`|Retorno al listado|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirExamenes()](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)
