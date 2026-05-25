# IdSw 2 > editarAsignatura > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-05-25
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `editarAsignatura()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y las dependencias necesarias con la entidad `Grado` para modificar la información de materias existentes.

## diagrama de colaboración

<div align=center>

|![Análisis: editarAsignatura()](/images/01-analisis/casos-uso/editarAsignatura/editarAsignatura-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/editarAsignatura/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarAsignaturaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Cargar y presentar los datos actuales de la asignatura al Administrador.
- Proveer una interfaz de selección para la reasignación de Grado (lista conceptual).
- Capturar las modificaciones en el formulario (Código, Nombre, Créditos, Grado).
- Gestionar las acciones de guardado y cancelación.
- Notificar el resultado de la operación.

**Colaboraciones**:
- **Entrada**: Recibe `editarAsignatura(asignatura)` desde `:Asignaturas Abierta`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Retorna a `:Asignaturas Abierta`.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la carga de datos y dependencias (Grados disponibles).
- Validar la integridad de los cambios y la unicidad del código (si cambia).
- Aplicar los cambios a la entidad `Asignatura`.
- Delegar la persistencia al repositorio.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EditarAsignaturaView`.
- **Repositorio**: Utiliza `AsignaturaRepository` y `GradoRepository`.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Persistir los cambios del objeto `Asignatura`.
- Verificar conflictos de identidad (código).

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer la lista conceptual de Grados para la modificación de la vinculación académica.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos de la materia.
- **Delegación**: Proporcionar información de su grado asociado sin romper el encapsulamiento.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la dependencia académica de la asignatura.

## flujo de colaboración

### secuencia de operaciones

1. **Carga**: `:Asignaturas Abierta` invoca `EditarAsignaturaView.editarAsignatura(asignatura)`.
2. **Carga de Contexto**: La vista solicita al controlador la lista conceptual de grados disponibles.
3. **Modificación**: El Administrador cambia datos y solicita guardar.
4. **Validación**: `AsignaturaController` verifica unicidad de código y la integridad de la nueva asociación con el grado.
5. **Cambio de Estado**: `AsignaturaController` actualiza la entidad `Asignatura` en memoria (`<<update>>`).
6. **Sincronización**: `AsignaturaController` entrega el objeto a `AsignaturaRepository.actualizar(asignatura)`.
7. **Finalización**: Se notifica el éxito y se retorna al listado general.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar datos actuales|`EditarAsignaturaView`|Carga inicial de datos|
|Permitir cambiar código, nombre, créditos|`EditarAsignaturaView`|Inputs del formulario|
|Cambiar grado asociado|`GradoRepository`|`obtenerTodos()`|
|Guardar cambios en base de datos|`AsignaturaRepository`|`actualizar(asignatura)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirAsignaturas()](/RUP/01-analisis/casos-uso/abrirAsignaturas/README.md)
