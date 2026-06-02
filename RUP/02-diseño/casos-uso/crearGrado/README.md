# IdSw 2 > crearGrado > Diseño

> |[🏠️](/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearGrado/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso crearGrado para la plataforma NestJS + Angular. Este diseño implementa el patrón "El Delgado", especificando el flujo desde la captura inicial de datos hasta la persistencia y la transición automática al estado de edición.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: crearGrado()](/images/02-diseño/casos-uso/crearGrado/crearGrado-secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/crearGrado/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| CrearGradoView | CrearGradoComponent (Angular) | - |
| - | GradoService (Angular) | - |
| GradoController | - | GradoController (NestJS) |
| - | - | GradoService (NestJS) |
| GradoRepository | - | GradoRepository (TypeORM) |
| Grado | - | Grado (Entity) |

## Detalles Técnicos

### 1. Comunicación API
- **Endpoint**: `POST /grados`
- **Cuerpo (Request)**: `CrearGradoDto` { codigo, nombre, descripcion }
- **Respuesta Exitosa**: `201 Created` + `GradoDto` (incluye el ID generado).
- **Validación**: Uso de `class-validator` en el DTO para asegurar que los campos cumplan con el formato y longitud requeridos.

### 2. Flujo de Navegación (Patrón El Delgado)
- Tras recibir la respuesta `201 Created`, el `CrearGradoComponent` utiliza el `Router` de Angular para navegar automáticamente a la ruta de edición: `/admin/grados/editar/:id`.
- Este cambio de estado permite que el Administrador continúe con el refinamiento de la entidad sin interrupciones.

### 3. Gestión de Errores
- Si el código ya existe, el servicio de NestJS lanza un `ConflictException`, que se traduce en un código `409 Conflict` para el cliente.

## Referencias

- [Análisis: crearGrado](/RUP/01-analisis/casos-uso/crearGrado/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
