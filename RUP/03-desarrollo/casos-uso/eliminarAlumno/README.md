# IdSw 2 > eliminarAlumno > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarAlumno/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/eliminarAlumno/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts)
- **Frontend:** [listar-alumnos.component.ts](/src/frontend/src/app/features/admin/alumnos/listar-alumnos/listar-alumnos.component.ts) · [alumno.service.ts](/src/frontend/src/app/core/services/alumno.service.ts)

## Descripción
Implementación de la eliminación de alumnos. El sistema permite el borrado individual o masivo de estudiantes mediante confirmación directa del administrador, asegurando la limpieza de registros en la base de datos MySQL.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### DELETE `/alumnos/bulk`
Elimina múltiples alumnos de forma atómica.
- **Body**: `{ ids: number[] }`.

### Lógica de Negocio
- **Persistencia destructiva**: Uso del método `delete()` de TypeORM para eliminar registros por ID de forma eficiente.
- **Simplicidad**: Siguiendo el diseño refinado, el proceso es directo sin diagnóstico de impacto sobre otras entidades.

---

## Frontend

### Implementación
#### ListarAlumnosComponent
- **Acciones Masivas**: Lógica integrada de selección múltiple mediante un `signal<Set<number>>`.
- **Confirmación Directa**: Uso de diálogos nativos para validar la intención del administrador.
- **Sincronización**: Refresco reactivo del listado tras la confirmación de éxito.

---

## Testing

### Backend (cURL)
```bash
# Eliminación masiva
curl -X DELETE http://localhost:3000/alumnos/bulk \
  -H "Content-Type: application/json" \
  -d '{ "ids": [1, 2, 3] }'
```
