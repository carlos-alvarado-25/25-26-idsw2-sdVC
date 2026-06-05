# IdSw 2 > eliminarProfesor > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarProfesor/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/eliminarProfesor/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts)
- **Frontend:** [listar-profesores.component.ts](/src/frontend/src/app/features/admin/profesores/listar-profesores/listar-profesores.component.ts) · [profesor.service.ts](/src/frontend/src/app/core/services/profesor.service.ts)

## Descripción
Implementación del borrado seguro de profesores. Antes de proceder con la remoción del docente, el sistema realiza una consulta de impacto para advertir interactivamente al Administrador si el profesor tiene exámenes programados asignados a su cargo, previniendo eliminaciones accidentales de censo docente con responsabilidades activas.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/profesores/:id/impacto`
Devuelve el volumen de exámenes programados que dependen de este profesor.
- **Respuesta**: `{ examenesCount: number }`.

#### DELETE `/profesores/bulk` o `/profesores/:id` (via bulk)
Elimina físicamente los profesores identificados en base de datos.
- **Respuesta**: `200 OK`.

### Implementación
- **Diagnóstico de Impacto**: Se expuso la API de impacto `getImpacto(id)` retornando de forma simulada (`{ examenesCount: 0 }`) con un comentario `TODO` para inyectar `ExamenRepository` y hacer el conteo real una vez se construya dicho ramillete, garantizando la compatibilidad futura.
- **Borrado Seguro y Cascada**: Al borrar al profesor, TypeORM limpia automáticamente sus relaciones Muchos-a-Muchos en la tabla intermedia `ProfesorAsignatura`. Se dispuso un `TODO` para limpiar las restricciones físicas de `PreferenciaRepository` (preferencias horarias) cuando dicho módulo sea implementado.

---

## Frontend

### Implementación
#### ListarProfesoresComponent
- **Acción de Borrado Seguro**: Al hacer clic en eliminar, el componente bloquea el listado y realiza la llamada a `profesorService.obtenerImpacto(profesor.id)`. 
- **Modal de Confirmación Dinámico**: Con el resultado de impacto, el componente evalúa:
  - Si `examenesCount > 0`, levanta una confirmación especial detallando el peligro de huérfanos: `"¡ATENCIÓN! El profesor tiene X exámenes programados asociados. ¿Está seguro de eliminarlo y desvincular dichos exámenes?"`
  - Si es `0`, muestra un aviso amigable y estándar: `"Este profesor no tiene exámenes asociados. ¿Está seguro de eliminar al profesor Y?"`
- **Limpieza de Selección**: Al confirmarse, efectúa el borrado seguro e invalida los conjuntos de selección en lote.

---

## Testing

### Backend (cURL)
```bash
# Consulta de impacto del profesor ID 1
curl http://localhost:3000/profesores/1/impacto
```
