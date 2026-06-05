# IdSw 2 > crearExamen > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearExamen/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/crearExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts) · [crear-examen.dto.ts](/src/backend/src/modules/examenes/dto/crear-examen.dto.ts)
- **Frontend:** [examen-form.component.ts](/src/frontend/src/app/features/admin/examenes/examen-form/examen-form.component.ts) · [examen.service.ts](/src/frontend/src/app/core/services/examen.service.ts)

## Descripción
Implementación del caso de uso de alta manual de exámenes programados. Aplica el patrón **"El Delgado"** para capturar únicamente los datos esenciales mínimos (`codigo`, `fecha`, `hora`, `duracion`, `tipo`, `asignaturaId`) y realiza una redirección automática del router de Angular al formulario de edición avanzada tras su creación exitosa.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/examenes`
Recibe los datos para la creación de un nuevo examen.
* **Cuerpo (Request):** `CrearExamenDto`
* **Respuestas:**
  * `201 Created` + `Examen` (con ID autogenerado).
  * `409 Conflict` si el código de examen ya está en uso.
  * `404 Not Found` si la asignatura vinculada no existe.

### Implementación
- **Validaciones:** Se utiliza `class-validator` para forzar restricciones en la entrada de datos. El `ExamenService` verifica la unicidad del código y la integridad de la clave foránea a `Asignatura` antes de persistir la entidad `Examen` en la base de datos MySQL.

---

## Frontend

### Implementación
#### ExamenFormComponent
- **Formulario Reactivo:** Control reactivo y validación del formulario de alta manual mediante `FormBuilder` y `ReactiveFormsModule`.
- **Selector Autocompletable (Datalist):** El selector de asignatura permite escribir directamente en el campo. Si la búsqueda supera los 2 caracteres, se realiza una consulta de filtrado en tiempo real mediante `AsignaturaService.filtrar()` aplicando un retardo (`debounceTime`) de 300ms, mapeando la selección al identificador numérico interno.
- **Redirección Proactiva (Patrón El Delgado):** Tras recibir un código `201 Created` con el ID asignado al examen, el componente inicia una temporización (`setTimeout`) de 1 segundo para redirigir mediante el `Router` al modo edición avanzada (`/admin/examenes/editar/:id`).
- **Restricción de Parámetros:** En modo creación, el payload enviado al backend excluye explícitamente `aulaId` y `profesorId`. Esto previene errores de validación de lista blanca en NestJS (`forbidNonWhitelisted`), que rechaza propiedades no definidas en `CrearExamenDto`.

---

## Testing

### Backend (cURL)
```bash
# Crear un examen válido
curl -X POST http://localhost:3000/examenes \
  -H "Content-Type: application/json" \
  -d '{"codigo":"EX-MAT1-2026", "fecha":"2026-06-15", "hora":"09:00", "duracion":120, "tipo":"Ordinaria", "asignaturaId":1}'

# Intentar duplicar código
curl -X POST http://localhost:3000/examenes \
  -H "Content-Type: application/json" \
  -d '{"codigo":"EX-MAT1-2026", "fecha":"2026-06-16", "hora":"10:30", "duracion":120, "tipo":"Ordinaria", "asignaturaId":1}'
```
