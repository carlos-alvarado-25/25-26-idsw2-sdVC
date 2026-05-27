# IdSw 2 > importarAulas > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-27
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `importarAulas()` mediante el patrón MVC. Este artefacto define el flujo para la carga masiva de espacios físicos desde archivos externos, garantizando la integridad referencial y la validación de unicidad de los recursos.

## diagrama de colaboración

<div align=center>

|![Análisis: importarAulas()](/images/01-analisis/casos-uso/importarAulas/importarAulas-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/importarAulas/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarAulasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de carga y mostrar el formato de archivo requerido.
- Mostrar la lista de tipos de aula disponibles para facilitar la preparación del archivo.
- Capturar el archivo seleccionado y gestionar el inicio de la importación.
- Presentar el resumen del proceso (`ImportResult`) y gestionar la finalización o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `importarAulas()` desde `:Aulas Abierto`.
- **Control**: Se comunica con `AulaController`.
- **Salida**: Retorna a `:Aulas Abierto`.

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Proveer la especificación del formato de archivo y catálogos de apoyo (Tipos de Aula).
- Orquestar el procesamiento del archivo y la validación de integridad referencial.
- Delegar la persistencia masiva al repositorio mediante `guardarLote`.
- Generar el balance de la operación (`ImportResult`).

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ImportarAulasView`.
- **Repositorio**: Utiliza `AulaRepository`.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Verificar la existencia de códigos de aula en el sistema.
- Persistir las nuevas aulas validadas.

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del espacio físico (código, nombre, capacidad, ubicación).

#### ImportResult
**Estereotipo**: Entidad (Inventada)  
**Responsabilidades**:
- Consolidar las estadísticas de la importación (total procesados, éxitos, fallos y causas).

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Aulas Abierto` invoca `ImportarAulasView.importarAulas()`.
2. **Contexto**: La vista solicita al controlador el formato requerido y los tipos de aula disponibles para guiar al usuario.
3. **Procesamiento**: El Administrador carga el archivo y solicita **Importar**.
4. **Validación y Carga**: `AulaController` procesa el archivo, valida unicidad y delega la persistencia a `AulaRepository.guardarLote(aulas)`.
5. **Resultado**: El controlador retorna un `ImportResult` con el resumen de éxitos y fallos.
6. **Cierre**: El Administrador selecciona `finalizarImportacion()` para retornar al listado general o `cancelarImportacion()` durante el proceso.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar archivo CSV/Excel|`ImportarAulasView`|Interfaz de carga|
|Validar códigos únicos de aula|`AulaController`|`AulaRepository.existeCodigo(codigo)`|
|Informar resultados y errores|`ImportResult`|Muestreo en la vista|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAulas()](/RUP/01-analisis/casos-uso/abrirAulas/README.md)
