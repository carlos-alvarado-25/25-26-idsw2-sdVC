# IdSw 2 > abrirAsignaturas > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirAsignaturas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/abrirAsignaturas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts) · [asignatura.entity.ts](/src/backend/src/entities/asignatura.entity.ts)
- **Frontend:** [listar-asignaturas.component.ts](/src/frontend/src/app/features/admin/asignaturas/listar-asignaturas/listar-asignaturas.component.ts) · [asignatura.service.ts](/src/frontend/src/app/core/services/asignatura.service.ts)

## Descripción
Implementación del hub de gestión de asignaturas. Permite visualizar el listado completo de materias, filtrado por criterios (nombre, código o grado) y navegación paginada, vinculando cada asignatura con su correspondiente grado académico.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints

#### GET `/asignaturas`
Retorna la lista de asignaturas paginada con las relaciones de Grado y CursoAcademico cargadas.
- **Query Params**: `page`.

#### GET `/asignaturas/search`
Busca asignaturas por nombre, código, grado o año académico.
- **Query Params**: `q`, `page`.

### Implementación
- **Principio de Delegación**: La entidad `Asignatura` provee la propiedad `nombreGrado` mediante un getter serializado, cumpliendo con la Ley de Demeter.
- **Relaciones**: Uso de `leftJoinAndSelect` para la entidad `Grado`.
- **Serialización**: Uso de `ClassSerializerInterceptor` en el controlador para exponer propiedades delegadas.
- **Seguridad**: Protegido mediante `JwtAuthGuard`.

---

## Frontend

### Implementación

#### ListarAsignaturasComponent
- **Signals**: Gestión reactiva del estado.
- **UI**: Tabla administrativa que utiliza directamente `asignatura.nombreGrado`.
- **Integridad**: Implementación de la lógica de confirmación informada para la eliminación.

---

## Testing

### Backend (cURL)
```bash
# Listado simple
curl http://localhost:3000/asignaturas?page=1

# Búsqueda dimensional
curl http://localhost:3000/asignaturas/search?q=Matematicas
```

## Notas de implementación
- Se ha respetado el estándar de `PagedResultDto` para mantener la coherencia con el ramillete de Grados.
