# IdSw 2 > eliminarAsignatura > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarAsignatura/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/eliminarAsignatura/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts)
- **Frontend:** [listar-asignaturas.component.ts](/src/frontend/src/app/features/admin/asignaturas/listar-asignaturas/listar-asignaturas.component.ts) · [asignatura.service.ts](/src/frontend/src/app/core/services/asignatura.service.ts)

## Descripción
Implementación de la eliminación segura de asignaturas. El proceso incluye un diagnóstico previo de impacto para advertir al usuario sobre la pérdida de datos vinculados (exámenes) antes de confirmar la eliminación física en la base de datos.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/asignaturas/:id/impacto`
Devuelve el conteo de dependencias vinculadas.
#### DELETE `/asignaturas/:id`
Elimina físicamente el registro de la asignatura.

### Implementación
- **Borrado Seguro**: El controlador gestiona la petición de eliminación tras la confirmación del frontend.
- **Cascada**: Se aplica `ON DELETE CASCADE` en las claves foráneas que dependen de esta entidad para mantener la integridad referencial a nivel de motor SQL.

---

## Frontend

### Implementación
#### ListarAsignaturasComponent
- **Flujo de Confirmación**: Se invoca a `verificarImpacto()` antes de mostrar el diálogo nativo `confirm()`.
- **Feedback Cuantitativo**: Si se detectan dependencias, se inyecta el número de registros afectados en el mensaje de advertencia.
- **Refresco Reactivo**: Tras la eliminación exitosa, se re-ejecuta la carga del listado manteniendo la página actual si es posible.

---

## Testing

### Ejecución (cURL)
```bash
# Diagnóstico
curl http://localhost:3000/asignaturas/1/impacto

# Eliminación
curl -X DELETE http://localhost:3000/asignaturas/1
```
