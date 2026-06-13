# IdSw 2 > generarCalendario > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/generarCalendario/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/generarCalendario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [calendario.controller.ts](/src/backend/src/modules/calendario/calendario.controller.ts) · [calendario.service.ts](/src/backend/src/modules/calendario/calendario.service.ts) · [calendario-engine.ts](/src/backend/src/modules/calendario/calendario-engine.ts) · [preferencia.entity.ts](/src/backend/src/entities/preferencia.entity.ts)
- **Frontend:** [generar-calendario.component.ts](/src/frontend/src/app/features/admin/calendario/generar-calendario/generar-calendario.component.ts) · [calendario.service.ts](/src/frontend/src/app/core/services/calendario.service.ts)

## información del artefacto

- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación
- **Versión**: 1.1 (Optimizado)
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## Descripción
Implementación del caso de uso del motor de calendarización automática de exámenes. Se introdujo una arquitectura basada en **Invención Pura** (`CalendarioEngine`) y **Experto en Información** en las entidades `Aula` y `Profesor` para desacoplar el algoritmo de asignación combinatorial de las dependencias de TypeORM. Se ha optimizado el rendimiento del motor combinatorial mediante la poda de ramas y la reducción de comparaciones redundantes.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/calendario/generar`
Recibe los parámetros temporales de la planificación para ejecutar el motor combinatorial.
* **Cuerpo (Request):** `GenerarCalendarioDto`
* **Respuestas:**
  * `201 Created` + `GeneracionResultDto` (contiene estadísticas y listado de exámenes en conflicto).

### Implementación
  * **`Aula`**: Expone `estaDisponibleEn()` para autoevaluar colisiones físicas de espacios contra los exámenes ya existentes en el rango (auditado para usar intersección de intervalos de tiempo en minutos para prevenir solapamientos).
  * **`Profesor`**: Expone `estaDisponibleEn()` (cruce contra preferencias/exclusiones horarias de la base de datos), `tieneCruceHorario()` (usando intersección de intervalos en minutos) y `puedeImpartirAsignatura()` (encapsulado para cumplir la Ley de Demeter).
- **Motor Combinatorial (`CalendarioEngine`)**: Clase pura de dominio en memoria que realiza la simulación atómica y devuelve el balance de planificación.
- **Optimizaciones de Rendimiento**:
  * **Dispersión por Curso**: El cálculo de la penalización de proximidad de exámenes evalúa tanto el `gradoId` como el `curso` de la asignatura, permitiendo que asignaturas del mismo grado pero de distintos años se agenden el mismo día sin penalización.
  * **Hoisting de Candidatos**: El filtro de profesores aptos para impartir la asignatura se realiza una única vez fuera del bucle anidado de slots y aulas.
  * **Poda de Slots (Pruning)**: Si ya tenemos una asignación válida y el slot evaluado tiene una puntuación de dispersión inferior o igual a la actual, se omiten todos sus bucles de aulas y profesores. Esto redujo el tiempo de procesamiento para 100 exámenes de 12.8s a 350ms.

---

## Frontend

### Implementación
- **Componente `GenerarCalendarioComponent`**:
  * Formulario reactivo que valida el rango de fechas (el inicio debe ser menor o igual al fin) y checkboxes estilizados para las franjas horarias habilitadas.
  * Muestra una animación de procesamiento (*Loader*) durante el tiempo de respuesta del servidor.
  * Renderiza dinámicamente un banner de resultados y tarjetas estadísticas. Si hay exámenes no programados, se presenta una tabla interactiva detallando el examen, asignatura y motivo del conflicto, con un enlace rápido para "Resolver" en la ficha de edición avanzada del examen.

---

## Testing

### Backend (cURL)
```bash
# Ejecutar la calendarización automática
curl -X POST http://localhost:3000/calendario/generar \
  -H "Content-Type: application/json" \
  -d '{"fechaInicio":"2026-06-15", "fechaFin":"2026-06-19", "franjasHorarias":["08:00-10:00","10:00-12:00","16:00-18:00"]}'
```
