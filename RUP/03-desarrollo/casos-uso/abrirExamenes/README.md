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
- **Principio de Delegación**: La entidad `Examen` provee las propiedades `nombreAsignatura`, `codigoAsignatura`, `nombreAula` y `nombreProfesor` mediante getters serializados, cumpliendo con la Ley de Demeter.
- **Serialización**: Uso de `ClassSerializerInterceptor` en el controlador para exponer las propiedades delegadas de forma plana hacia el Frontend.
- **Carga de Relaciones**: Uso de `leftJoinAndSelect` para recuperar eficientemente las dependencias.
- **Paginación**: Utiliza `PagedResultDto` con un tamaño de página de 10 elementos.

---

## Frontend

### Implementación
#### ListarExamenesComponent
- **Uso de Delegación**: El componente utiliza directamente las propiedades delegadas del Backend (`examen.nombreAsignatura`, etc.), simplificando drásticamente los helpers de formateo en la vista.
- **Control con Signals**: Gestión reactiva del estado mediante `signals` de Angular.
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
