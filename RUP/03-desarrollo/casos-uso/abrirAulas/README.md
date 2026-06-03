# IdSw 2 > abrirAulas > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirAulas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/abrirAulas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts) · [aula.entity.ts](/src/backend/src/entities/aula.entity.ts)
- **Frontend:** [listar-aulas.component.ts](/src/frontend/src/app/features/admin/aulas/listar-aulas/listar-aulas.component.ts) · [aula.service.ts](/src/frontend/src/app/core/services/aula.service.ts)

## Descripción
Implementación del hub de gestión de aulas y espacios físicos. Permite visualizar el inventario completo de recursos, con capacidades, ubicación (edificio/planta) y tipología, facilitando el acceso a las operaciones de mantenimiento.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/aulas`
Retorna el listado completo de aulas ordenado por nombre.
#### GET `/aulas/search`
Filtra aulas por nombre, código o edificio.

### Implementación
- **Persistencia**: Uso de TypeORM para mapear la entidad `Aula` a MySQL.
- **Volumetría**: Siguiendo el análisis, se ha omitido la paginación del servidor debido al bajo volumen de registros previsto para esta entidad.

---

## Frontend

### Implementación
#### ListarAulasComponent
- **Consistencia Visual**: Reutilización de los estilos CSS de administración para asegurar una experiencia de usuario unificada.
- **Signals**: Uso de `signal<Aula[]>` para la gestión reactiva del estado del listado.
- **Confirmación de Borrado**: Integración de la lógica de diagnóstico de impacto antes de la eliminación.

---

## Testing

### Backend (cURL)
```bash
# Listado completo
curl http://localhost:3000/aulas

# Búsqueda
curl http://localhost:3000/aulas/search?q=Laboratorio
```
