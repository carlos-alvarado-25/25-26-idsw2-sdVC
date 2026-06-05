# IdSw 2 > eliminarExamen > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarExamen/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/eliminarExamen/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboración (Elaboration)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `eliminarExamen()`, especificando el flujo de confirmación interactiva para evitar pérdidas accidentales de datos y el protocolo de eliminación física en la base de datos MySQL de manera segura.

## diagrama de secuencia

<div align=center>

|![Diseño: eliminarExamen()](/images/02-diseño/casos-uso/eliminarExamen/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/eliminarExamen/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Eliminar Examen
- **Método**: `DELETE`
- **Ruta**: `/examenes/:id`

- **Respuestas**:
  * `200 OK` (o `204 No Content`): Remoción exitosa de la base de datos.
  * `404 Not Found`: Si el examen no existe (por ejemplo, si fue borrado simultáneamente en otra sesión).

- **Integridad Referencial (MySQL / TypeORM)**:
  * El borrado de un `Examen` remueve las dependencias directas en cascada (como las entidades `Incidencia` asociadas mediante la restricción `onDelete: 'CASCADE'`).
  * Las relaciones con `Aula` y `Profesor` se rompen limpiamente de forma automática en MySQL sin afectar los registros de catálogo de aulas o docentes.

### Frontend (Angular)

#### ExamenApiService
- `eliminar(id: number): Observable<void>`

#### Flujo de Confirmación en ListarExamenesComponent
1. **Petición de Borrado**: El Administrador hace clic en el botón de eliminar del listado de exámenes.
2. **Presentación de Confirmación**: Se invoca un diálogo modal interactivo (`ConfirmDialogComponent`) que despliega la información crítica del examen para validación visual:
   * Nombre de la Asignatura
   * Fecha y Hora de la evaluación
   * Código de Aula asignada (si tiene)
   * Nombre del Profesor supervisor (si tiene)
3. **Ejecución**: Si el usuario cancela, se descarta la acción cerrando el diálogo. Si confirma, se dispara la llamada a `ExamenApiService.eliminar(id)`.
4. **Respuesta**: Al completarse exitosamente la remoción, se muestra un mensaje toast informativo de éxito y se recarga automáticamente el listado de exámenes de forma reactiva (`recargarListado()`).

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EliminarExamenView` | `ConfirmDialogComponent` (Angular) | Ventana emergente de confirmación interactiva con datos resumidos. |
| - | `ListarExamenesComponent` (Angular) | Orquestación de la recarga reactiva y control del diálogo modal. |
| - | `ExamenApiService` (Angular) | Cliente HTTP para disparar la petición HTTP `DELETE`. |
| `ExamenController` | `ExamenController` (NestJS) | Exposición del endpoint `DELETE /examenes/:id`. |
| - | `ExamenService` (NestJS) | Validación de existencia y orden de eliminación en persistencia. |
| `ExamenRepository` | `ExamenRepository` (TypeORM) | Eliminación física en la base de datos MySQL (con cascada activa). |
| `Examen` | `Examen` (Entity) | Modelo físico de datos. |

## referencias

- [Análisis: eliminarExamen](/RUP/01-analisis/casos-uso/eliminarExamen/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
