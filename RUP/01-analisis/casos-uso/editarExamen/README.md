# IdSw 2 > editarExamen > Análisis

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

Análisis de colaboración del caso de uso `editarExamen()` mediante el patrón MVC, identificando las clases de análisis y las dependencias necesarias con las entidades `Asignatura` y `Aula` para modificar la programación de exámenes existentes.

## diagrama de colaboración

<div align=center>

|![Análisis: editarExamen()](/images/01-analisis/casos-uso/editarExamen/editarExamen-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/editarExamen/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarExamenView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Cargar y presentar los datos actuales del examen al Administrador.
- Proveer interfaces para la búsqueda paginada de asignaturas.
- Mostrar la lista de aulas disponibles para su reasignación.
- Capturar las modificaciones y gestionar las acciones de guardado y cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `editarExamen(examen)` desde `:Exámenes Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Retorna a `:Exámenes Abierto`.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la carga de dependencias dinámicas (Asignaturas, Aulas).
- Validar la integridad de los cambios (unicidad de código, disponibilidad de recursos).
- Aplicar los cambios a la entidad `Examen`.
- Delegar la persistencia al repositorio.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EditarExamenView`.
- **Repositorio**: Utiliza `ExamenRepository`, `AsignaturaRepository` y `AulaRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Persistir los cambios del objeto `Examen` en el almacenamiento permanente.
- Verificar conflictos de identidad (código).

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer búsqueda paginada de asignaturas para el cambio de vinculación.

#### AulaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer el listado de aulas disponibles para la asignación física del examen.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular el estado del examen y permitir su actualización controlada.

## flujo de colaboración

### secuencia de operaciones

1. **Carga**: `:Exámenes Abierto` invoca `EditarExamenView.editarExamen(examen)`.
2. **Carga de Contexto**: La vista solicita al controlador las listas de apoyo (Asignaturas searchable y Aulas).
3. **Modificación**: El Administrador realiza cambios en fecha, duración, asignatura o aula y solicita guardar.
4. **Validación de Negocio**: `ExamenController` verifica que el nuevo código (si cambia) sea único y valida las nuevas asociaciones.
5. **Cambio de Estado**: `ExamenController` actualiza la entidad `Examen` en memoria (`<<update>>`).
6. **Sincronización**: `ExamenController` entrega el objeto modificado a `ExamenRepository.actualizar(examen)`.
7. **Finalización**: Se notifica el éxito y se retorna al listado general.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Permitir introducir nueva fecha/hora/duración|`EditarExamenView`|Inputs del formulario|
|Cambiar asignatura asociada|`AsignaturaRepository`|`buscarPaginadas(criterio, pagina)`|
|Cambiar aula asignada|`AulaRepository`|`listarTodas()`|
|Guardar cambios en base de datos|`ExamenRepository`|`actualizar(examen)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirExamenes()](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)
