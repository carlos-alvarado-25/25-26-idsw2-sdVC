# IdSw 2 > editarAlumno > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarAlumno/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/editarAlumno/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts) · [update-alumno.dto.ts](/src/backend/src/modules/alumnos/dto/update-alumno.dto.ts)
- **Frontend:** [alumno-form.component.ts](/src/frontend/src/app/features/admin/alumnos/alumno-form/alumno-form.component.ts) · [alumno.service.ts](/src/frontend/src/app/core/services/alumno.service.ts)

## Descripción
Implementación de la edición de perfiles de alumnos. Permite al administrador modificar los datos de un estudiante existente, asegurando que la matrícula siga siendo única y que el grado vinculado sea válido.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### PATCH `/alumnos/:id`
Actualiza parcialmente los datos de un alumno.
- **Body**: `UpdateAlumnoDto` (nombre, email, curso, gradoId).

### Lógica de Negocio
- **Carga de Datos**: El controlador expone `GET /alumnos/:id` para poblar el formulario inicial.
- **Validación de Identidad**: Si se modifica la matrícula, el servicio verifica que no esté en uso por otro registro.
- **Integridad Académica**: Validación de existencia del `Grado` referenciado.

---

## Frontend

### Implementación
#### AlumnoFormComponent (Modo Edición)
- **Carga Reactiva**: Uso de `ActivatedRoute` para capturar el ID y solicitar los datos al inicializar.
- **Feedback**: Mensajes de éxito temporales que permiten al usuario saber que los cambios se han persistido.
- **Estado Singular**: El usuario permanece en la vista de edición tras el guardado para permitir cambios sucesivos.

---

## Testing

### Backend (cURL)
```bash
curl -X PATCH http://localhost:3000/alumnos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Lima Actualizado",
    "curso": 3
  }'
```
