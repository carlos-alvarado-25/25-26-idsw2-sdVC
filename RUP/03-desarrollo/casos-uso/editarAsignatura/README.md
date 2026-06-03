# IdSw 2 > editarAsignatura > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarAsignatura/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/editarAsignatura/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts) · [update-asignatura.dto.ts](/src/backend/src/modules/asignaturas/dto/update-asignatura.dto.ts)
- **Frontend:** [asignatura-form.component.ts](/src/frontend/src/app/features/admin/asignaturas/asignatura-form/asignatura-form.component.ts) · [asignatura.service.ts](/src/frontend/src/app/core/services/asignatura.service.ts)

## Descripción
Implementación de la modificación incremental de asignaturas. Permite la actualización de cualquier atributo de la materia, manteniendo la integridad referencial y visualizando los cambios en tiempo real mediante el estado singular de edición.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### PATCH `/asignaturas/:id`
Actualiza parcialmente los datos de una asignatura.
- **Body**: `UpdateAsignaturaDto` (campos opcionales).

### Lógica de Negocio
- **Carga de Relaciones**: Al recuperar la entidad para edición, se cargan los objetos `grado` y `cursoAcademico` para poblar los selectores.
- **Actualización Atómica**: Uso del método `Object.assign` para combinar los cambios y `save()` para persistir.

---

## Frontend

### Implementación
#### AsignaturaFormComponent (Modo Edición)
- **Carga Inicial**: Recuperación de datos por ID al inicializar el componente.
- **Validación Cruzada**: El formulario se bloquea durante el proceso de guardado para evitar colisiones.
- **Feedback**: Mensajes de éxito que desaparecen automáticamente tras 3 segundos.

---

## Testing

### Backend (cURL)
```bash
curl -X PATCH http://localhost:3000/asignaturas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Programación Avanzada",
    "creditos": 9
  }'
```
