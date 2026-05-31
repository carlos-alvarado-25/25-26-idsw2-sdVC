# IdSw 2 > descargarCalendarioExamenes > Análisis

> |[🏠️](/README.md)|[  📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-30
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `descargarCalendarioExamenes()` mediante el patrón MVC. Este artefacto define el proceso de exportación de la programación académica a formatos portátiles (PDF/Excel), asegurando la aplicación de filtros contextuales por actor y delegando la generación física del documento a un componente de servicio especializado.

## diagrama de colaboración

<div align=center>

|![Análisis: descargarCalendarioExamenes()](/images/01-analisis/casos-uso/descargarCalendarioExamenes/descargarCalendarioExamenes-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/descargarCalendarioExamenes/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### DescargarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Proveer la interfaz para la selección de formato (PDF/Excel), el período a exportar y la información específica a incluir en el documento.
- Capturar las preferencias del usuario y solicitar la generación del archivo.
- Presentar el enlace de descarga o gestionar la descarga automática del documento generado.

**Colaboraciones**:
- **Entrada**: Recibe `descargarCalendario()` desde `:Calendario Abierto`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Retorna a `:Calendario Abierto`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Identificar al actor en sesión para filtrar la información exportable.
- Coordinar la recuperación de exámenes desde el repositorio.
- Delegar la transformación de datos a formato de archivo al `ExportService`.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `DescargarCalendarioView`.
- **Repositorio**: Utiliza `ExamenRepository`.
- **Sesión**: Consulta el contexto en `:Session`.
- **Servicio**: Utiliza `ExportService`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Recuperar la colección de exámenes filtrada por el período temporal y el perfil de actor.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer los datos académicos para la exportación (fecha, hora, aula, asignatura, profesor).

#### ExportService
**Estereotipo**: Entidad (Utility/Inventada)  
**Responsabilidades**:
- Transformar una colección de entidades `Examen` en un flujo de datos binario (Archivo).
- Aplicar plantillas de formato y filtrar campos específicos según las opciones seleccionadas (PDF o Excel).

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El usuario solicita descargar el calendario desde la vista de consulta.
2. **Configuración**: `:Calendario Abierto` invoca `DescargarCalendarioView.descargarCalendario()`.
3. **Petición**: El usuario selecciona formato, período y opciones de contenido, e invoca `generarArchivo(periodo, formato, opciones)`.
4. **Contextualización**: El controlador obtiene el actor desde la sesión para garantizar la visibilidad de los datos.
5. **Consulta**: El controlador recupera los exámenes correspondientes desde `ExamenRepository`.
6. **Transformación**: El controlador entrega la lista de exámenes a `ExportService.exportar(examenes, formato, opciones)`.
7. **Entrega**: El servicio devuelve el archivo (`File`) al controlador, quien lo transfiere a la vista para su puesta a disposición del usuario.
8. **Finalización**: Se confirma la descarga y se retorna al estado previo `:Calendario Abierto`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar formato (PDF/Excel)|`DescargarCalendarioView`|Interfaz de opciones|
|Seleccionar período a exportar|`DescargarCalendarioView`|Interfaz de opciones|
|Seleccionar información a incluir|`DescargarCalendarioView`|Interfaz de opciones|
|Generar archivo del calendario|`ExportService`|`exportar(examenes, formato, opciones)`|
|Filtrado por actor (Admin/Prof/Alu)|`CalendarioController`|Consulta a `:Session`|
|Presentar enlace de descarga|`DescargarCalendarioView`|Salida binaria|

## referencias

- [Especificación detallada: Detalle de Casos de Uso (Administrador)](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: consultarCalendario()](/RUP/01-analisis/casos-uso/consultarCalendario/README.md)
