# IdSw 2 > eliminarGrado > Diseño

> |[🏠️](/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarGrado/README.md)|**Diseño**|[Desarrollo](/RUP/03-desarrollo/casos-uso/eliminarGrado/README.md)|Pruebas|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso eliminarGrado para la plataforma NestJS + Angular. Este diseño especifica el flujo de borrado seguro, integrando una consulta previa de impacto para cuantificar las dependencias académicas (asignaturas) antes de confirmar la eliminación física en MySQL.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: eliminarGrado()](/images/02-diseño/casos-uso/eliminarGrado/eliminarGrado-secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/eliminarGrado/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| EliminarGradoView | ListarGradosComponent (Angular) | - |
| - | GradoService (Angular) | - |
| GradoController | - | GradoController (NestJS) |
| - | - | GradoService (NestJS) |
| GradoRepository | - | GradoRepository (TypeORM) |
| AsignaturaRepository | - | AsignaturaRepository (TypeORM) |

## Detalles Técnicos

### 1. Comunicación API
- **Impacto**: `GET /grados/:id/impacto` (Retorna el número de asignaturas vinculadas).
- **Eliminación**: `DELETE /grados/:id`.

### 2. Borrado Seguro
- El diseño obliga a una consulta al `AsignaturaRepository` previa a la eliminación. Esta información es presentada al Administrador en un modal de confirmación de Angular para mitigar el riesgo de pérdida accidental de datos relacionados.

## Referencias

- [Análisis: eliminarGrado](/RUP/01-analisis/casos-uso/eliminarGrado/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
