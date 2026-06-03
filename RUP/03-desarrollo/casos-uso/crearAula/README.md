# IdSw 2 > crearAula > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearAula/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/crearAula/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts) · [create-aula.dto.ts](/src/backend/src/modules/aulas/dto/create-aula.dto.ts)
- **Frontend:** [aula-form.component.ts](/src/frontend/src/app/features/admin/aulas/aula-form/aula-form.component.ts) · [aula.service.ts](/src/frontend/src/app/core/services/aula.service.ts)

## Descripción
Implementación de la creación manual de aulas y espacios físicos. Sigue el patrón "El Delgado", permitiendo un alta rápida con redirección automática al estado de edición para completar detalles si fuera necesario.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/aulas`
Crea un nuevo recurso físico.
- **Body**: `CreateAulaDto` (codigo, nombre, capacidad, edificio, planta, tipo).

### Lógica de Negocio
- **Validación de Unicidad**: Se verifica que no exista otra aula con el mismo código.
- **Persistencia**: Uso de TypeORM para el guardado asíncrono.

---

## Frontend

### Implementación
#### AulaFormComponent
- **Componente Unificado**: Gestiona tanto el alta como la edición mediante detección de ruta.
- **Redirección Estratégica**: Tras el éxito (HTTP 201), el sistema navega automáticamente a la ruta de edición `/admin/aulas/editar/:id`.
- **Validación Reactiva**: Uso de `ReactiveFormsModule` para asegurar la integridad de los datos antes del envío.

---

## Testing

### Backend (cURL)
```bash
curl -X POST http://localhost:3000/aulas \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "LAB-201",
    "nombre": "Laboratorio de Redes",
    "capacidad": 20,
    "edificio": "Politécnico",
    "planta": "2ª Planta",
    "tipo": "Laboratorio"
  }'
```
