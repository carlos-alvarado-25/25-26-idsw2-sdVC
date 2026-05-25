# IdSw 2 > importarAsignaturas > Análisis

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

Análisis de colaboración del caso de uso `importarAsignaturas()` mediante el patrón MVC, identificando las clases de análisis, responsabilidades y colaboraciones necesarias para la carga masiva de asignaturas y su correcta vinculación con los grados académicos existentes.

## diagrama de colaboración

<div align=center>

|![Análisis: importarAsignaturas()](/images/01-analisis/casos-uso/importarAsignaturas/importarAsignaturas-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/importarAsignaturas/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarAsignaturasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de importación al Administrador.
- Mostrar la especificación del formato de archivo (CSV/Excel) incluyendo la columna obligatoria de vinculación con Grado.
- Capturar el archivo seleccionado.
- Presentar el resumen del procesamiento masivo (`ImportResult`).
- Gestionar la finalización o cancelación del flujo.

**Colaboraciones**:
- **Entrada**: Recibe `importarAsignaturas()` desde `:Asignaturas Abierta`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Retorna a `:Asignaturas Abierta`.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Proporcionar la guía de formato para la importación.
- Coordinar el procesamiento del archivo recibido.
- Validar la integridad de los datos en lote.
- **Resolución de Dependencias**: Validar que los grados referenciados en el archivo existan en el sistema antes de crear la asignatura.
- Transformar filas en objetos `Asignatura` vinculados a sus respectivos `Grado`.
- Gestionar los resultados de la operación masiva.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarAsignaturasView`.
- **Repositorio**: Delega la persistencia masiva a `AsignaturaRepository`.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Implementar el guardado masivo de asignaturas (`guardarLote`).
- Verificar la unicidad de códigos de asignatura durante el proceso.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar los datos de una materia académica.
- Mantener el estado de su asociación con un `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Actuar como la dependencia necesaria para que una asignatura sea válida.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Asignaturas Abierta` invoca `ImportarAsignaturasView.importarAsignaturas()`.
2. **Preparación**: La vista solicita y muestra el formato requerido vía `AsignaturaController`.
3. **Carga**: El Administrador sube el archivo con los datos de las materias.
4. **Procesamiento**: `AsignaturaController` valida el archivo y resuelve las asociaciones con los grados existentes.
5. **Persistencia**: `AsignaturaController` solicita `guardarLote(asignaturas)` al repositorio.
6. **Resultados**: Se muestra el `ImportResult` en la vista detallando éxitos y fallos de validación.
7. **Retorno**: El Administrador finaliza y el sistema refresca `:Asignaturas Abierta`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Permitir seleccionar archivo de importación|`ImportarAsignaturasView`|Interfaz de usuario|
|Muestra formato requerido|`AsignaturaController`|`obtenerFormatoRequerido()`|
|Validar existencia de grados asociados|`AsignaturaController`|Lógica de resolución de dependencias|
|Guardar lote de asignaturas|`AsignaturaRepository`|`guardarLote(asignaturas)`|
|Muestra resultados y permite revisar errores|`ImportarAsignaturasView`|Visualización de `ImportResult`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirAsignaturas()](/RUP/01-analisis/casos-uso/abrirAsignaturas/README.md)
