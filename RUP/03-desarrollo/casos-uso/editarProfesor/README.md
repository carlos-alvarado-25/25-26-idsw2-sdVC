# IdSw 2 > editarProfesor > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarProfesor/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/editarProfesor/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts) · [profesor.entity.ts](/src/backend/src/entities/profesor.entity.ts)
- **Frontend:** [profesor-form.component.ts](/src/frontend/src/app/features/admin/profesores/profesor-form/profesor-form.component.ts) · [profesor.service.ts](/src/frontend/src/app/core/services/profesor.service.ts) · [asignatura.service.ts](/src/frontend/src/app/core/services/asignatura.service.ts)

## Descripción
Implementación de la edición de profesores y la gestión interactiva Muchos-a-Muchos de su carga lectiva. Permite actualizar los datos de contacto del docente y vincular/desvincular asignaturas dinámicamente mediante un panel interactivo que cuenta con un buscador integrado de asignaturas.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### PATCH `/profesores/:id`
Actualiza incrementalmente la información del profesor y/o su listado de asignaturas impartidas.
- **Cuerpo (Body)**: `UpdateProfesorDto` { `nombre`?, `email`?, `departamento`?, `asignaturasIds`?: number[] }.
- **Respuesta**: `200 OK` con el objeto del profesor actualizado y sus asignaturas vinculadas.

### Implementación
- **Asociación Dinámica**: En `ProfesorService`, si se proporciona un array `asignaturasIds`, se recuperan dichas materias de base de datos (`In(asignaturasIds)`) y se asignan a `profesor.asignaturas`. TypeORM y MySQL gestionan automáticamente la persistencia atómica en la tabla intermedia Muchos-a-Muchos `ProfesorAsignatura`.
- **Validación de Unicidad**: Se valida que no se repitan correos electrónicos o códigos exceptuando al profesor actualmente editado (`id !== profesorId`).

---

## Frontend

### Implementación
#### ProfesorFormComponent
- **Componente Único Dinámico**: Al detectar el parámetro `:id` en la ruta, se habilita el modo de edición (`isEditMode() = true`), cargando tanto los campos textuales del docente como su colección local de asignaturas.
- **UI Gestión Muchos-a-Muchos**: 
  - **Panel Izquierdo:** Muestra las asignaturas asociadas actualmente con un botón de desvinculación rápida (`✕`) que actualiza el estado local (`asignaturasSeleccionadas`).
  - **Panel Derecho:** Dispone de un buscador interactivo conectado a `AsignaturaService.filtrar()`. Permite buscar por código o nombre de asignatura, mostrando resultados y ofreciendo un botón reactivo `➕ Asignar` (que cambia a `Asignada` si la materia ya está seleccionada).
- **Envío Sincronizado**: El envío del formulario sincroniza y envía tanto los campos del profesor como la lista aplanada de IDs de asignaturas al endpoint `PATCH /profesores/:id`.

---

## Testing

### Backend (cURL)
```bash
# Asignación de materias (ejemplo: ID de materias 1 y 2 al profesor ID 1)
curl -X PATCH http://localhost:3000/profesores/1 \
  -H "Content-Type: application/json" \
  -d '{"asignaturasIds":[1, 2]}'
```
