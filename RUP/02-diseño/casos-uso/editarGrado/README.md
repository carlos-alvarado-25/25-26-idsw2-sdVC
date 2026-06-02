# IdSw 2 > editarGrado > Diseño

> |[🏠️](/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarGrado/README.md)|**Diseño**|[Desarrollo](/RUP/03-desarrollo/casos-uso/editarGrado/README.md)|Pruebas|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso editarGrado para la plataforma NestJS + Angular. Este diseño especifica la carga de datos existentes y la persistencia incremental de cambios, manteniendo al Administrador en el estado estable de edición según el estándar de UX del proyecto.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: editarGrado()](/images/02-diseño/casos-uso/editarGrado/editarGrado-secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/editarGrado/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| EditarGradoView | GradoFormComponent (Angular) | - |
| - | GradoService (Angular) | - |

| GradoController | - | GradoController (NestJS) |
| - | - | GradoService (NestJS) |
| GradoRepository | - | GradoRepository (TypeORM) |
| Grado | - | Grado (Entity) |

## Detalles Técnicos

### 1. Comunicación API
- **Obtención**: `GET /grados/:id`
- **Actualización**: `PATCH /grados/:id`
- **Cuerpo (Request)**: `UpdateGradoDto` { codigo?, nombre?, descripcion? }
- **Respuesta**: `200 OK` + `GradoDto`.

### 2. Lógica de Persistencia Incremental
- El diseño utiliza el método `PATCH` para permitir actualizaciones parciales.
- El controlador y servicio aseguran que si el `codigo` es modificado, se valide su unicidad en la base de datos antes de aplicar el cambio, lanzando un `409 Conflict` en caso de duplicidad.

## Frontend

### Implementación

#### GradoFormComponent
- **Navegación por Estado Estable**: Implementación de una UX circular que confirma el guardado pero no redirige al listado, permitiendo ediciones sucesivas.
- **Modo Edición**: El componente detecta el ID en la URL y carga los datos existentes desde la API.
- **Signals**: Uso de signals para gestionar estados de `success` y `loading`.

## Referencias

- [Análisis: editarGrado](/RUP/01-analisis/casos-uso/editarGrado/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
