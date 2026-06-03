# IdSw 2 > editarGrado > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarGrado/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/editarGrado/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts)
- **Frontend:** [grado-form.component.ts](/src/frontend/src/app/features/admin/grados/grado-form/grado-form.component.ts)

## Descripción
Implementación de la actualización incremental de grados. El sistema permite modificar los datos existentes mediante el método HTTP PATCH y mantiene al usuario en la misma vista tras el éxito.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### PATCH `/grados/:id`
Actualiza parcialmente un grado académico.
- **Request Body**: `UpdateGradoDto` (parcial)
- **Validaciones**: Si se cambia el código, se verifica unicidad.

## Frontend

### Implementación

#### GradoFormComponent
- **Componente Unificado**: Gestión dinámica de la vista según la presencia de ID en la URL.
- **Navegación por Estado Estable**: Implementación de una UX circular que confirma el guardado pero no redirige al listado, permitiendo ediciones sucesivas.
- **Signals**: Uso de signals para gestionar estados de `success` y `loading`.

---

## Testing

### Backend (cURL)
```bash
curl -X PATCH http://localhost:3000/grados/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Grado en Ingeniería Informática (Actualizado)"}'
```
