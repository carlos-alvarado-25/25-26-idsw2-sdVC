# IdSw 2 > crearAsignatura > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearAsignatura/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/crearAsignatura/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts) · [crear-asignatura.dto.ts](/src/backend/src/modules/asignaturas/dto/crear-asignatura.dto.ts)
- **Frontend:** [asignatura-form.component.ts](/src/frontend/src/app/features/admin/asignaturas/asignatura-form/asignatura-form.component.ts) · [asignatura.service.ts](/src/frontend/src/app/core/services/asignatura.service.ts)

## Descripción
Implementación de la creación manual de asignaturas. Sigue el patrón "El Delgado", donde tras una validación exitosa de los campos mínimos y la vinculación con un Grado y Curso Académico, se redirige al usuario a la vista de edición para completar o refinar los datos.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/asignaturas`
Crea una nueva asignatura.
- **Body**: `CrearAsignaturaDto` (codigo, nombre, creditos, nivel, gradoId, cursoAcademicoId).

### Lógica de Negocio
- **Validación de Unicidad**: Se comprueba que el código de la asignatura no exista previamente.
- **Integridad Referencial**: Verificación de existencia del `Grado` y el `CursoAcademico` antes de la persistencia.

---

## Frontend

### Implementación
#### AsignaturaFormComponent
- **Modo Dual**: El componente detecta mediante la URL si debe operar en modo "Creación" o "Edición".
- **Selectores Reactivos**: Carga dinámica de la lista de Grados y Cursos Académicos Activos para asegurar vínculos válidos.
- **Redirección Estratégica**: Tras el éxito (HTTP 201), el sistema navega automáticamente a la ruta de edición mediante `router.navigate`.

---

## Testing

### Backend (cURL)
```bash
curl -X POST http://localhost:3000/asignaturas \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ALG102",
    "nombre": "Álgebra Lineal",
    "creditos": 6,
    "nivel": 1,
    "gradoId": 13,
    "cursoAcademicoId": 1
  }'
```
