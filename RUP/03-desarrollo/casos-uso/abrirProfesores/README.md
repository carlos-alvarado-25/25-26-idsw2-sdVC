# IdSw 2 > abrirProfesores > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirProfesores/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/abrirProfesores/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts) · [profesor.entity.ts](/src/backend/src/entities/profesor.entity.ts)
- **Frontend:** [listar-profesores.component.ts](/src/frontend/src/app/features/admin/profesores/listar-profesores/listar-profesores.component.ts) · [profesor.service.ts](/src/frontend/src/app/core/services/profesor.service.ts)

## Descripción
Implementación de la visualización del censo de profesores de la institución. Habilita una tabla administrativa que muestra la información de contacto (código, nombre, email, departamento) y la carga docente de cada profesor, integrando navegación paginada, filtrado por criterios múltiples y soporte para operaciones en lote.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/profesores`
Retorna el listado paginado de profesores cargando la relación Muchos-a-Muchos de asignaturas asignadas.
- **Query Params**: `page` (opcional, por defecto 1).

#### GET `/profesores/search`
Permite buscar profesores de manera dimensional a partir de su código, nombre, email, departamento o por el nombre de las asignaturas que imparte.
- **Query Params**: `q` (cadena de búsqueda), `page` (opcional).

### Implementación
- **Optimización de Consultas**: Uso de `leftJoinAndSelect` sobre la relación Muchos-a-Muchos `profesor.asignaturas` para traer en una sola consulta toda la información relevante, previniendo el problema de rendimiento N+1.
- **Formato de Paginación**: Utiliza `PagedResultDto` para estructurar la respuesta con el total de registros, página actual y páginas totales, basándose en un tamaño fijo de 10 elementos por página.

---

## Frontend

### Implementación
#### ListarProfesoresComponent
- **Mapeo de Datos (Law of Demeter)**: El componente recibe al profesor y aplana la colección de asignaturas en una cadena separada por comas (`getAsignaturasNombres()`), evitando acoplar la vista directamente a la entidad Asignatura.
- **Estructura del Listado**: Incluye selectores (checkboxes) para cada fila con soporte para selección múltiple (utilizando `signals` y `Set`) con vistas a futuras acciones masivas de eliminación.
- **Diseño Responsivo y Cohesivo**: Reutilización total de la hoja de estilos global y las clases utilitarias del sistema administrativo (`admin-container`, `data-table`, `filters-section`, etc.) heredadas del ramillete de referencia de Grados/Alumnos.

---

## Testing

### Backend (cURL)
```bash
# Listado inicial
curl http://localhost:3000/profesores?page=1

# Búsqueda por departamento
curl http://localhost:3000/profesores/search?q=Matemática
```
