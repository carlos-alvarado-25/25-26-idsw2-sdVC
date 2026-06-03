# IdSw 2 > abrirGrados > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirGrados/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/abrirGrados/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts) · [grado.entity.ts](/src/backend/src/entities/grado.entity.ts)
- **Frontend:** [listar-grados.component.ts](/src/frontend/src/app/features/admin/grados/listar-grados/listar-grados.component.ts) · [grado.service.ts](/src/frontend/src/app/core/services/grado.service.ts)

## Descripción
Punto de entrada para la gestión de grados académicos. Implementa un listado paginado y un motor de búsqueda por criterios (nombre y código), sirviendo como el hub principal para las operaciones CRUD.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/grados`
Retorna la lista de grados paginada.
- **Query Params**: `page` (default 1).

#### GET `/grados/search`
Busca grados por nombre o código.
- **Query Params**: `q` (criterio), `page`.

### Implementación
- **TypeORM**: Uso de `findAndCount()` para optimizar la carga y el conteo de registros en una sola consulta.
- **DTO Genérico**: Implementación de `PagedResultDto<T>` para estandarizar las respuestas de listados masivos.

---

## Frontend

### Implementación

#### ListarGradosComponent
- **Signals**: Uso de `signal<T>` de Angular 19/21 para una gestión reactiva y eficiente del estado del listado.
- **Diseño**: Interfaz administrativa limpia con breadcrumbs, barra de búsqueda y controles de paginación.
- **Feedback**: Overlay de carga (`table-overlay`) durante las peticiones asíncronas.

---

## Testing

### Backend (cURL)
```bash
# Listado simple
curl http://localhost:3000/grados?page=1

# Búsqueda
curl http://localhost:3000/grados/search?q=Informatica
```

## Notas de implementación
- La paginación está configurada con un tamaño fijo de 10 registros por página en el servidor.
