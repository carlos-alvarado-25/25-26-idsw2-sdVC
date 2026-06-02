# IdSw 2 > crearGrado > Desarrollo

> |[🏠️](/RUP/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearGrado/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/crearGrado/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts) · [crear-grado.dto.ts](/src/backend/src/modules/grados/dto/crear-grado.dto.ts)
- **Frontend:** [crear-grado.component.ts](/src/frontend/src/app/features/admin/grados/crear-grado/crear-grado.component.ts)

## Descripción
Implementación del alta manual de grados académicos. Sigue el patrón "El Delgado", permitiendo una creación rápida con validación de unicidad de código y redirección automática al modo de edición.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/grados`
Crea un nuevo grado.
- **Request Body**: `CrearGradoDto`
- **Validaciones**: Código único, longitud de nombre.
- **Respuesta**: `201 Created`

### Implementación
- **ConflictException**: NestJS lanza un error 409 si el código ya existe en MySQL, detectado mediante un `findOneBy` previo en el servicio.

---

## Frontend

### Implementación

#### CrearGradoComponent
- **Reactive Forms**: Uso de `FormBuilder` para gestionar el estado y la validación del formulario.
- **UX Flow**: Tras recibir el objeto creado con su ID, el componente utiliza el `Router` de Angular para enviar al usuario a la vista de edición.

---

## Testing

### Backend (cURL)
```bash
curl -X POST http://localhost:3000/grados \
  -H \"Content-Type: application/json\" \
  -d '{\"codigo\": \"GINF\", \"nombre\": \"Grado en Ingeniería Informática\"}'
```

## Notas de implementación
- La redirección a edición está preparada para recibir el ID generado por el autoincrement de MySQL.
