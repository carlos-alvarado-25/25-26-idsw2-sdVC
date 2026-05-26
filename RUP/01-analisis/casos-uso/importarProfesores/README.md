# IdSw 2 > importarProfesores > Análisis

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

Análisis de colaboración del caso de uso `importarProfesores()` mediante el patrón MVC, identificando las clases de análisis, responsabilidades y colaboraciones necesarias para la carga masiva de docentes y la validación de integridad (emails únicos y departamentos válidos).

## diagrama de colaboración

<div align=center>

|![Análisis: importarProfesores()](/images/01-analisis/casos-uso/importarProfesores/importarProfesores-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/importarProfesores/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarProfesoresView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de importación masiva al Administrador.
- Mostrar la especificación del formato requerido (CSV/Excel).
- Visualizar el listado de departamentos disponibles para guiar la carga.
- Capturar el archivo seleccionado por el usuario.
- Presentar los resultados del procesamiento (`ImportResult`).
- Manejar las solicitudes de finalización o cancelación del proceso.

**Colaboraciones**:
- **Entrada**: Recibe `importarProfesores()` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Retorna control a `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Proporcionar la guía de formato y la lista de departamentos válidos.
- Coordinar el procesamiento del archivo recibido.
- Validar la integridad de los datos en lote (campos obligatorios y formato).
- **Validación de Unicidad**: Asegurar que los emails en el archivo no estén duplicados ni existan previamente en el sistema.
- Transformar filas del archivo en objetos `Profesor`.
- Gestionar los resultados de la operación masiva para la vista.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarProfesoresView`.
- **Repositorio**: Delega la persistencia masiva a `ProfesorRepository`.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el acceso a la persistencia de los profesores.
- Implementar la lógica de guardado en lote (`guardarLote`).
- Proveer métodos para verificar la existencia de emails en la base de datos.

**Colaboraciones**:
- **Control**: Responde a solicitudes de `ProfesorController`.
- **Entidad**: Gestiona instancias de `Profesor`.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un docente (nombre, código, email, departamento).
- Mantener la integridad de sus propios atributos.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Profesores Abierto` invoca `ImportarProfesoresView.importarProfesores()`.
2. **Configuración**: La vista solicita el formato y departamentos al `ProfesorController`.
3. **Carga**: El Administrador selecciona y envía el archivo.
4. **Validación Masiva**: `ProfesorController` procesa el archivo y valida la unicidad de emails.
5. **Persistencia**: El controlador solicita `guardarLote(profesores)` al repositorio.
6. **Resultados**: La vista muestra el resumen de la importación (número de éxitos, errores por fila y correcciones necesarias).
7. **Cierre**: El flujo retorna a `:Profesores Abierto`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar archivo CSV/Excel|`ImportarProfesoresView`|Interfaz de usuario|
|Muestra departamentos disponibles|`ProfesorController`|`obtenerDepartamentosDisponibles()`|
|Valida emails únicos|`ProfesorController`|Lógica de validación interna|
|Muestra número de profesores importados|`ImportarProfesoresView`|Visualización de `ImportResult`|
|Muestra errores y correcciones|`ImportarProfesoresView`|Detalle de `ImportResult`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirProfesores()](/RUP/01-analisis/casos-uso/abrirProfesores/README.md)
