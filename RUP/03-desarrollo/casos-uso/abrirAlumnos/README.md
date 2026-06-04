# IdSw 2 > abrirAlumnos > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/abrirAlumnos/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts) · [alumno.entity.ts](/src/backend/src/entities/alumno.entity.ts)
- **Frontend:** [listar-alumnos.component.ts](/src/frontend/src/app/features/admin/alumnos/listar-alumnos/listar-alumnos.component.ts) · [alumno.service.ts](/src/frontend/src/app/core/services/alumno.service.ts)

## Descripción
Implementación del censo de alumnos. Permite visualizar el listado completo de estudiantes de la institución, con soporte para navegación paginada, búsqueda dimensional (por matrícula, nombre, email o grado) y gestión de acciones masivas.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/alumnos`
Retorna el listado de alumnos paginado con la relación de Grado cargada.
- **Query Params**: `page`.

#### GET `/alumnos/search`
Filtra alumnos por matrícula, nombre, email o nombre del grado.
- **Query Params**: `q`, `page`.

### Implementación
- **Relaciones**: Uso de `leftJoinAndSelect` en el QueryBuilder para recuperar el nombre del grado asociado de forma eficiente.
- **Paginación**: Aplicación del estándar `PagedResultDto` con un tamaño de página de 10 registros.

---

## Frontend

### Implementación
#### ListarAlumnosComponent
- **Acciones Masivas**: Integración de la lógica de selección múltiple (Set de IDs) y eliminación en lote.
- **Gestión de Estado**: Uso de Angular Signals para una reactividad moderna en el listado y los indicadores de carga.
- **Consistencia Visual**: Herencia de los estilos administrativos estandarizados (`admin-container`, `data-table`).

---

## Testing

### Backend (cURL)
```bash
# Listado simple
curl http://localhost:3000/alumnos?page=1

# Búsqueda por matrícula
curl http://localhost:3000/alumnos/search?q=ALU001
```
