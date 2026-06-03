# IdSw 2 > editarAula > Desarrollo

> |[🏠️](/README.md)|[  📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarAula/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/editarAula/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts) · [update-aula.dto.ts](/src/backend/src/modules/aulas/dto/update-aula.dto.ts)
- **Frontend:** [aula-form.component.ts](/src/frontend/src/app/features/admin/aulas/aula-form/aula-form.component.ts) · [aula.service.ts](/src/frontend/src/app/core/services/aula.service.ts)

## Descripción
Implementación de la edición incremental de aulas. Permite al Administrador modificar cualquier atributo del espacio físico, manteniendo la integridad referencial y permitiendo la permanencia en el estado de edición tras cada guardado (Estado Singular).

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### PATCH `/aulas/:id`
Actualiza parcialmente los datos del aula.
- **Body**: `UpdateAulaDto` (campos opcionales).

### Lógica de Negocio
- **Carga de Datos**: El controlador expone `GET /aulas/:id` para poblar el formulario inicial.
- **Validación de Identidad**: Si se modifica el código del aula, el servicio verifica que el nuevo identificador no esté en uso por otro registro.
- **Actualización Atómica**: Uso de `Object.assign` y `save()` para sincronizar los cambios en MySQL.

---

## Frontend

### Implementación
#### AulaFormComponent (Modo Edición)
- **Carga Reactiva**: Uso de `ActivatedRoute` para capturar el ID y solicitar los datos al servicio al inicializar.
- **Feedback Continuo**: Mensajes de éxito temporales que permiten al usuario saber que los cambios se han persistido sin necesidad de abandonar la vista.
- **Validación Dinámica**: Los campos obligatorios se validan en tiempo real, bloqueando el botón de envío si hay errores.

---

## Testing

### Backend (cURL)
```bash
curl -X PATCH http://localhost:3000/aulas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "capacidad": 45,
    "tipo": "Aula Magna"
  }'
```
