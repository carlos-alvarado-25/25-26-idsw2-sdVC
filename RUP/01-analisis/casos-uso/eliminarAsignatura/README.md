# IdSw 2 > eliminarAsignatura > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-25
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `eliminarAsignatura()` mediante el patrón MVC, identificando las clases de análisis y responsabilidades necesarias para la eliminación segura de materias académicas, asegurando la integridad referencial con los exámenes programados.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarAsignatura()](/images/01-analisis/casos-uso/eliminarAsignatura/eliminarAsignatura-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/eliminarAsignatura/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarAsignaturaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el diálogo de confirmación de eliminación al Administrador.
- Mostrar los detalles de la asignatura (Código, Nombre, Grado).
- Visualizar advertencias cuantitativas si existen exámenes asociados a la materia.
- Capturar la decisión final del usuario (Confirmar/Cancelar).
- Notificar el resultado de la operación.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarAsignatura(asignatura)` desde `:Asignaturas Abierta`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Retorna a `:Asignaturas Abierta`.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de eliminación de la asignatura.
- Verificar la existencia de dependencias (exámenes) antes de proceder.
- Delegar la eliminación física al repositorio de asignaturas.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EliminarAsignaturaView`.
- **Repositorio**: Utiliza `AsignaturaRepository` para la eliminación y `ExamenRepository` para la verificación de impacto.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Gestionar la eliminación del registro de la asignatura en la persistencia.

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer información sobre la cantidad de exámenes vinculados a una asignatura específica (`contarPorAsignatura`).

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la materia académica a eliminar.

## flujo de colaboración

### secuencia de operaciones

1. **Selección**: `:Asignaturas Abierta` invoca `EliminarAsignaturaView.eliminarAsignatura(asignatura)`.
2. **Verificación de Impacto**: `EliminarAsignaturaView` solicita al `AsignaturaController` verificar si hay exámenes asociados.
3. **Consulta de Dependencias**: `AsignaturaController` solicita a `ExamenRepository` el conteo de exámenes para esa materia.
4. **Confirmación**: La vista presenta los datos y la advertencia cuantitativa (ej. "Esta materia tiene 3 exámenes asociados"). El Administrador confirma la acción.
5. **Ejecución**: `EliminarAsignaturaView` → `AsignaturaController.eliminar(asignatura)`.
6. **Persistencia**: `AsignaturaController` → `AsignaturaRepository.eliminar(asignatura)`.
7. **Finalización**: Se informa el éxito y se refresca el listado en `:Asignaturas Abierta`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar confirmación de eliminación|`EliminarAsignaturaView`|Interfaz de usuario|
|Muestra advertencia sobre exámenes|`ExamenRepository`|`contarPorAsignatura(asignatura)`|
|Eliminar asignatura de la base de datos|`AsignaturaRepository`|`eliminar(asignatura)`|
|Actualizar lista de asignaturas|`EliminarAsignaturaView`|Retorno al listado|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirAsignaturas()](/RUP/01-analisis/casos-uso/abrirAsignaturas/README.md)
