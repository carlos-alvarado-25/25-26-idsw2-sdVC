# IdSw 2 > abrirGrados > Diseño

> |[🏠️](/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirGrados/README.md)|**Diseño**|[Desarrollo](/RUP/03-desarrollo/casos-uso/abrirGrados/README.md)|Pruebas|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso abrirGrados para la plataforma NestJS + Angular. Este diseño especifica la interacción para el listado paginado y filtrado de grados académicos, garantizando una respuesta eficiente de la API mediante el uso de TypeORM para el acceso a MySQL.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: abrirGrados()](/images/02-diseño/casos-uso/abrirGrados/abrirGrados-secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/abrirGrados/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| ListarGradosView | ListarGradosComponent (Angular) | - |
| - | GradoService (Angular) | - |
| GradoController | - | GradoController (NestJS) |
| - | - | GradoService (NestJS) |
| GradoRepository | - | GradoRepository (TypeORM) |
| Grado | - | Grado (Entity) |

## Detalles Técnicos

### 1. Comunicación API
- **Listado**: `GET /grados?page=X` (Retorna `PagedResultDto<Grado>`).
- **Búsqueda**: `GET /grados/search?q=criterio&page=X`.

### 2. Acceso a Datos
- Se utiliza el método `findAndCount()` de TypeORM para obtener simultáneamente el subconjunto de datos y el total de registros necesarios para la paginación.
- Los filtros se aplican mediante cláusulas `Like` en el repositorio para permitir búsquedas parciales por código o nombre.

## Referencias

- [Análisis: abrirGrados](/RUP/01-analisis/casos-uso/abrirGrados/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
