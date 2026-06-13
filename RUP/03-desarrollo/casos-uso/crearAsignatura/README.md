# IdSw 2 > crearAsignatura > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearAsignatura/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/crearAsignatura/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts) · [crear-asignatura.dto.ts](/src/backend/src/modules/asignaturas/dto/crear-asignatura.dto.ts)
- **Frontend:** [asignatura-form.component.ts](/src/frontend/src/app/features/admin/asignaturas/asignatura-form/asignatura-form.component.ts)

## información del artefacto

- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## Descripción
Implementación de la creación manual de asignaturas. Sigue el patrón "El Delgado", donde tras una validación exitosa de los campos mínimos, vinculación con un Grado y asignación de curso académico, se redirige al usuario a la vista de edición para completar o refinar los datos.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/asignaturas`
Crea una nueva asignatura.
- **Body**: `CrearAsignaturaDto` (codigo, nombre, creditos, curso, cuatrimestre, gradoId).

### Lógica de Negocio
- **Validación de Unicidad**: Se comprueba que el código de la asignatura no exista previamente.
- **Integridad Referencial**: Verificación de existencia del `Grado` antes de la persistencia.
- **Curso Académico**: Persistencia del campo `curso` (1, 2, 3 o 4) para permitir un filtrado óptimo en el algoritmo de dispersión temporal.
- **Cuatrimestre / Semestre**: Persistencia del campo `cuatrimestre` (1 o 2) para posibilitar el aislamiento de exámenes por semestre en la misma titulación y mitigar solapamientos de alumnos repetidores.

---

## Frontend

### Implementación
#### AsignaturaFormComponent
- **Modo Dual**: El componente detecta mediante la URL si debe operar en modo "Creación" o "Edición".
- **Selectores Reactivos**: Carga dinámica de la lista de Grados para asegurar vínculos válidos.
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
    "curso": 1,
    "cuatrimestre": 1,
    "gradoId": 13
  }'
```
