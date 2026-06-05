# IdSw 2 > editarExamen > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarExamen/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/editarExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts) · [update-examen.dto.ts](/src/backend/src/modules/examenes/dto/update-examen.dto.ts)
- **Frontend:** [examen-form.component.ts](/src/frontend/src/app/features/admin/examenes/examen-form/examen-form.component.ts) · [examen.service.ts](/src/frontend/src/app/core/services/examen.service.ts)

## Descripción
Implementación de la edición avanzada y programación de exámenes. Permite al Administrador modificar los datos iniciales y programar los recursos físicos y humanos (asignación de Aula y designación de Profesor supervisor), ejecutando de forma proactiva validaciones para evitar conflictos de horarios.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/examenes/:id`
Recupera el examen con su asignatura, aula y profesor supervisor cargados.

#### PATCH `/examenes/:id`
Actualiza incrementalmente el examen aplicando reglas de negocio.
* **Cuerpo (Request):** `UpdateExamenDto`
* **Respuestas:**
  * `200 OK` + `Examen` (actualizado).
  * `404 NotFoundException` si el examen, la asignatura, el aula o el profesor no existen.
  * `409 ConflictException` en caso de:
    * El código de examen ya está en uso.
    * El aula seleccionada está ocupada en esa franja horaria por otro examen.
    * El profesor ya supervisa otro examen en esa franja horaria.

### Implementación
- **Algoritmo de Solapamiento Temporal:** Para validar los cruces de recursos en el backend (`ExamenService`), se convierten las horas de inicio (`hora` HH:MM) y su duración a minutos transcurridos desde medianoche. El sistema recupera los exámenes programados para ese recurso (aula o profesor) en la misma fecha y verifica la condición de solapamiento en memoria:
  $$\text{Inicio}_1 < \text{Fin}_2 \quad \text{y} \quad \text{Inicio}_2 < \text{Fin}_1$$
  Si se cumple, se rechaza la operación devolviendo una excepción de conflicto.

---

## Frontend

### Implementación
#### ExamenFormComponent
- **Carga de Dependencias y Buscadores:** Al activarse el modo edición (`id` en la ruta `/admin/examenes/editar/:id`), se consultan concurrentemente el examen actual y el catálogo completo de aulas.
- **Asignación de Aula de Doble Columna:** En lugar de desplegables simples o datalists tradicionales, la asignación de Aula se realiza a través de un panel dinámico de doble columna (reutilizando el patrón de diseño implementado en la pantalla de profesores). Cuenta con un buscador de aulas en tiempo real y opciones de "Asignar" y "Desvincular" en caliente. El Profesor Supervisor asignado se muestra en modo solo lectura, ya que su gestión se realiza a través del caso de uso correspondiente (`asignarProfesorAExamen`).
- **Gestión de Errores en Caliente:** En caso de solapamiento de horarios (HTTP 409), el formulario captura la excepción y visualiza el aviso de error detallado provisto por el backend.

---

## Testing

### Backend (cURL)
```bash
# Obtener un examen por ID
curl http://localhost:3000/examenes/1

# Asignar aula y profesor a un examen existente
curl -X PATCH http://localhost:3000/examenes/1 \
  -H "Content-Type: application/json" \
  -d '{"aulaId":1, "profesorId":1}'

# Intentar asignar la misma aula en el mismo horario a otro examen (Conflicto)
curl -X PATCH http://localhost:3000/examenes/2 \
  -H "Content-Type: application/json" \
  -d '{"fecha":"2026-06-15", "hora":"09:30", "duracion":120, "aulaId":1}'
```
