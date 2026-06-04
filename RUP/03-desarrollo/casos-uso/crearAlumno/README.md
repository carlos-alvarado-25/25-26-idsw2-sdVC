# IdSw 2 > crearAlumno > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearAlumno/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/crearAlumno/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts) · [crear-alumno.dto.ts](/src/backend/src/modules/alumnos/dto/crear-alumno.dto.ts)
- **Frontend:** [alumno-form.component.ts](/src/frontend/src/app/features/admin/alumnos/alumno-form/alumno-form.component.ts) · [alumno.service.ts](/src/frontend/src/app/core/services/alumno.service.ts)

## Descripción
Implementación de la creación manual de alumnos. Sigue el patrón "El Delgado", permitiendo un alta rápida con matrícula, nombre, email, curso y grado, redirigiendo automáticamente al estado de edición detallada tras el éxito.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/alumnos`
Crea un nuevo perfil de estudiante.
- **Body**: `CrearAlumnoDto` (matricula, nombre, email, curso, gradoId).

### Lógica de Negocio
- **Validación de Unicidad**: Se verifica que la matrícula no esté registrada previamente.
- **Integridad Académica**: Comprobación de existencia del `Grado` referenciado mediante inyección de dependencias del `GradoRepository`.

---

## Frontend

### Implementación
#### AlumnoFormComponent
- **Componente Dual**: Gestiona creación y edición compartiendo lógica reactiva y validaciones.
- **Selectores Dinámicos**: Carga el catálogo de Grados para asegurar vínculos académicos válidos.
- **Redirección de Flujo**: Tras recibir un HTTP 201, navega hacia `/admin/alumnos/editar/:id`.

---

## Testing

### Backend (cURL)
```bash
curl -X POST http://localhost:3000/alumnos \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "ALU999",
    "nombre": "Estudiante de Prueba",
    "email": "prueba@idsw.edu",
    "curso": 1,
    "gradoId": 24
  }'
```
