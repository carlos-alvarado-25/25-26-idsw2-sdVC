# IdSw 2 > eliminarExamen > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarExamen/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/eliminarExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [listar-examenes.component.ts](/src/frontend/src/app/features/admin/examenes/listar-examenes/listar-examenes.component.ts) · [listar-examenes.component.html](/src/frontend/src/app/features/admin/examenes/listar-examenes/listar-examenes.component.html) · [examen.service.ts](/src/frontend/src/app/core/services/examen.service.ts)

## Descripción
Implementación del caso de uso de eliminación física de exámenes programados. El Administrador puede eliminar un examen desde la vista del listado general tras confirmar la acción a través de un diálogo interactivo estándar. El borrado respeta la integridad referencial configurada en la base de datos (con cascada de borrado o anulación de claves foráneas).

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### DELETE `/examenes/:id`
Elimina físicamente el examen con el ID especificado.
* **Respuestas:**
  * `200 OK` (retorna la entidad eliminada o confirmación).
  * `404 Not Found` si el examen no existe en la base de datos.

### Implementación
- **ExamenService:** El método `remove(id)` comprueba la existencia de la entidad en MySQL llamando a `findOne(id)` y posteriormente la elimina mediante `examenRepository.remove(examen)`.
- **Integridad:** Las relaciones están configuradas en TypeORM de tal manera que las claves foráneas a `Aula` y `Profesor` se colocan a `NULL` (`onDelete: 'SET NULL'`) al eliminar el examen, mientras que los registros dependientes que requieran cascada completa se eliminarán.

---

## Frontend

### Implementación
#### ListarExamenesComponent
- **Diálogo de Confirmación:** Se hace uso del método `confirm()` del navegador para solicitar confirmación interactiva al Administrador antes de realizar cualquier llamada destructiva.
- **Invocación al Servicio:** Si el Administrador confirma, se hace una llamada a `ExamenService.eliminar(examen.id)`. Mientras se procesa la petición HTTP, el estado de carga (`loading`) se establece a true y las acciones quedan bloqueadas.
- **Actualización Reactiva:** Una vez devuelta la respuesta HTTP con éxito, se vuelve a cargar la lista de exámenes de la página actual llamando a `cargarExamenes(currentPage())` de forma fluida.

---

## Testing

### Backend (cURL)
```bash
# Eliminar un examen existente
curl -X DELETE http://localhost:3000/examenes/1

# Intentar eliminar un examen inexistente
curl -X DELETE http://localhost:3000/examenes/9999
```
