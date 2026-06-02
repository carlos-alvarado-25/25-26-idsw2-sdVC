# IdSw 2 > importarGrados > Diseño

> |[🏠️](/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarGrados/README.md)|**Diseño**|[Desarrollo](/RUP/03-desarrollo/casos-uso/importarGrados/README.md)|Pruebas|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso importarGrados para la plataforma NestJS + Angular. Este diseño especifica el flujo de carga de archivos multipart, el procesamiento por lotes en la capa de servicios y la persistencia atómica en MySQL mediante TypeORM.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: importarGrados()](/images/02-diseño/casos-uso/importarGrados/importarGrados-secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/importarGrados/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| ImportarGradosView | ImportarGradosComponent (Angular) | - |
| - | GradoService (Angular) | - |
| GradoController | - | GradoController (NestJS) |
| - | - | GradoService (NestJS) |
| GradoRepository | - | GradoRepository (TypeORM) |
| Grado | - | Grado (Entity) |
| ImportResult | - | ImportResultDto |

## Detalles Técnicos

### 1. Comunicación API
- **Endpoint**: `POST /grados/importar`
- **Protocolo**: Multipart/Form-Data para la subida de archivos (CSV/XLSX).
- **Respuesta**: `201 Created` + `ImportResultDto`.

### 2. Procesamiento en el Servidor
- Se utiliza una estrategia de **Validación Previa**: se parsea el archivo y se verifica la existencia de cada código en el repositorio antes de la inserción masiva.
- La persistencia se realiza mediante el método `save()` de TypeORM, pasando un arreglo de entidades para optimizar el rendimiento mediante una única transacción o inserción por lotes.

### 3. Manejo de Errores
- Errores de formato de archivo (400 Bad Request).
- Registros duplicados se consolidan en el objeto de balance en lugar de interrumpir el proceso (resiliencia de importación).

## Referencias

- [Análisis: importarGrados](/RUP/01-analisis/casos-uso/importarGrados/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
