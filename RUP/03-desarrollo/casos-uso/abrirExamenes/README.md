# IdSw 2 > abrirExamenes > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/abrirExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts) · [examen.entity.ts](/src/backend/src/entities/examen.entity.ts)
- **Frontend:** [listar-examenes.component.ts](/src/frontend/src/app/features/admin/examenes/listar-examenes/listar-examenes.component.ts) · [examen.service.ts](/src/frontend/src/app/core/services/examen.service.ts)

## Descripción
Implementación de la visualización del calendario académico de exámenes programados. Habilita una tabla administrativa para que el Administrador consulte los exámenes, mostrando su código, asignatura, fecha, hora, duración, tipo, aula asignada y profesor supervisor, integrando navegación paginada y filtrado multidimensional.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/examenes`
Retorna el listado paginado de exámenes cargando las relaciones asociadas de `Asignatura`, `Aula` y `Profesor`.
- **Query Params**: `page` (opcional, por defecto 1).

#### GET `/examenes/search`
Permite buscar exámenes de manera dimensional a partir de su código de examen, código o nombre de la asignatura, código o nombre del aula, y nombre del profesor.
- **Query Params**: `q` (criterio de búsqueda), `page` (opcional).

### Implementación
- **Carga de Relaciones**: Uso de `leftJoinAndSelect` (o TypeORM relations mapping) para recuperar de manera eficiente las relaciones y evitar consultas N+1 en la base de datos MySQL.
- **Paginación**: Utiliza `PagedResultDto` basándose en un tamaño de página de 10 elementos por página.

---

## Frontend

### Implementación
#### ListarExamenesComponent
- **Control con Signals**: Gestión reactiva del estado de carga, total de registros, página actual y la colección de exámenes mediante `signals` de Angular.
- **Formateado de Relaciones**: El componente utiliza helpers para concatenar y visualizar limpiamente los códigos y nombres de las dependencias (`Asignatura`, `Aula` y `Profesor`), manejando estados sin asignar con valores descriptivos predeterminados.
- **Consistencia de Estilos (UI/UX)**: Implementa las clases utilitarias del diseño global del panel de administración (`admin-container`, `data-table`, `filters-section`, etc.) heredadas estrictamente del ramillete de referencia de Grados.

---

## Testing

### Backend (cURL)
```bash
# Obtener listado de exámenes (página 1)
curl http://localhost:3000/examenes?page=1

# Buscar exámenes filtrando por asignatura o aula
curl http://localhost:3000/examenes/search?q=Matemática
```
