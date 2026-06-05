# IdSw 2 > asignarProfesorAExamen > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/asignarProfesorAExamen/README.md)|**Diseño**|[🏗️ Desarrollo](/RUP/03-desarrollo/casos-uso/asignarProfesorAExamen/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboración (Elaboration)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## propósito

Realización técnica del caso de uso `asignarProfesorAExamen()` para la plataforma NestJS + Angular. Este diseño especifica el flujo de vinculación de un docente a un examen programado sin supervisor asignado, incluyendo la verificación de conflictos de solapamiento horario antes de confirmar la asignación. La operación se origina desde el estado `:Profesor Abierto` (`/admin/profesores/editar/:id`) y retorna al mismo estado tras completarse.

## diagrama de secuencia

<div align=center>

|![Diseño: asignarProfesorAExamen()](/images/02-diseño/casos-uso/asignarProfesorAExamen/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/asignarProfesorAExamen/secuencia.puml)|

</div>

## flujo de navegación

```
/admin/profesores/editar/:profesorId   (:Profesor Abierto)
    └─▶  click "Asignar Examen"
           └─▶  /admin/profesores/:profesorId/asignar-examen   (AsignarProfesorExamenComponent)
                   └─▶  [Éxito / Volver]  /admin/profesores/editar/:profesorId
```

## especificación de contratos y DTOs

### Backend (NestJS)

#### 1. Obtener Exámenes Sin Supervisor (Buscador Paginado)
- **Método**: `GET`
- **Ruta**: `/examenes?sinProfesor=true&q=:criterio&page=:n`
- **Respuesta**: `PagedResult<ExamenDto>` — solo retorna exámenes con `profesorId IS NULL`.
- **Implementación**: El `ExamenService` añade condición `where: { profesorId: IsNull() }` al `findAndCount` del repositorio.

#### 2. Verificar Conflicto Horario del Profesor
- **Método**: `GET`
- **Ruta**: `/examenes/:id/conflictoProfesor?profesorId=:profesorId`
- **Respuesta**: `{ tieneConflicto: boolean, descripcion?: string }`
- **Lógica**: El `ExamenService` consulta al repositorio si el `profesorId` tiene algún otro examen (distinto al `:id` actual) el mismo día cuya franja horaria se solape. El cálculo de solapamiento se basa en `hora` + `duracion` (en minutos).

#### 3. Asignar Profesor al Examen
- **Método**: `PATCH`
- **Ruta**: `/examenes/:id`
- **Cuerpo (Request)**:

```typescript
// Subconjunto de UpdateExamenDto
{ profesorId: number }
```

- **Respuesta Exitosa**: `200 OK` + `ExamenDto` con el profesor ya vinculado.
- **Errores**:
  - `404 Not Found` — si el examen o el profesor no existen.
  - `409 Conflict` — si el profesor ya supervisa otro examen solapado en la misma franja horaria (validación final en backend como defensa en profundidad).

### Frontend (Angular)

#### Ruta
```typescript
{ path: 'profesores/:profesorId/asignar-examen', component: AsignarProfesorExamenComponent }
```

#### AsignarProfesorExamenComponent

- Lee `profesorId` desde los parámetros de ruta (`ActivatedRoute`).
- **Al iniciar**: Llama a `ProfesorApiService.obtener(profesorId)` para mostrar el nombre del docente como contexto fijo (no editable).
- **Buscador de exámenes**: Campo de texto con debounce que llama a `ExamenApiService.buscarSinProfesor(q, page)`. Presenta los resultados en tarjetas seleccionables con los datos del examen (código, asignatura, fecha, hora).
- **Selección de examen**: Al seleccionar, llama automáticamente a `ExamenApiService.verificarConflictoProfesor(examen.id, profesorId)`:
  - Si **sin conflicto**: habilita el botón "Confirmar Asignación" con badge verde de disponibilidad.
  - Si **con conflicto**: muestra alerta de advertencia con descripción del conflicto y deshabilita el botón de confirmación.
- **Confirmación**: Llama a `ExamenApiService.actualizar(examen.id, { profesorId })`. En caso de éxito, muestra mensaje de éxito y regresa a `/admin/profesores/editar/:profesorId`.

#### ExamenApiService — Métodos nuevos

```typescript
buscarSinProfesor(q: string, page: number): Observable<PagedResult<ExamenDto>>
// GET /examenes?sinProfesor=true&q=:q&page=:page

verificarConflictoProfesor(examenId: number, profesorId: number): Observable<{ tieneConflicto: boolean, descripcion?: string }>
// GET /examenes/:examenId/conflictoProfesor?profesorId=:profesorId
```

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño (Frontend) | Componente de Diseño (Backend) |
|---|---|---|
| `AsignarProfesorView` | `AsignarProfesorExamenComponent` (Angular) | - |
| - | `ExamenApiService` (Angular) | - |
| - | `ProfesorApiService` (Angular) | - |
| `ExamenController` | - | `ExamenController` (NestJS) |
| - | - | `ExamenService` (NestJS) |
| `ExamenRepository` | - | `ExamenRepository` (TypeORM) |
| `ProfesorRepository` | - | `ProfesorRepository` (TypeORM) |
| `Examen` | - | `Examen` (Entity) |
| `Profesor` | - | `Profesor` (Entity) |

## decisiones de diseño

1. **Profesor pre-seleccionado como contexto**: Dado que el flujo nace desde `:Profesor Abierto`, el `profesorId` se extrae de la ruta, mostrándose como dato fijo de contexto. El Administrador no necesita buscarlo, reduciendo la fricción del flujo.
2. **Verificación previa en frontend**: La comprobación de conflicto horario se realiza en el frontend al seleccionar el examen (antes de confirmar), ofreciendo retroalimentación inmediata sin necesidad de esperar al envío del formulario.
3. **Validación final en backend**: El backend re-ejecuta la validación de solapamiento en el `PATCH /examenes/:id` como defensa en profundidad, garantizando la integridad del calendario incluso ante condiciones de carrera.
4. **Filtro `sinProfesor=true`**: El buscador de exámenes muestra exclusivamente registros con `profesorId IS NULL`, reduciendo el conjunto de opciones al mínimo semánticamente relevante para el caso de uso.
5. **Reutilización de endpoint `PATCH /examenes/:id`**: No se crea un endpoint específico para la asignación; se reutiliza el endpoint de actualización parcial de exámenes con un payload `{ profesorId }`, manteniendo la consistencia arquitectónica de la API REST.

## referencias

- [Análisis: asignarProfesorAExamen](/RUP/01-analisis/casos-uso/asignarProfesorAExamen/README.md)
- [Diseño: editarProfesor](/RUP/02-diseño/casos-uso/editarProfesor/README.md)
- [Diseño: editarExamen](/RUP/02-diseño/casos-uso/editarExamen/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
