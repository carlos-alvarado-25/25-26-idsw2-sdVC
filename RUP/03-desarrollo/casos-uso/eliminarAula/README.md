# IdSw 2 > eliminarAula > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarAula/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/eliminarAula/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts)
- **Frontend:** [listar-aulas.component.ts](/src/frontend/src/app/features/admin/aulas/listar-aulas/listar-aulas.component.ts) · [aula.service.ts](/src/frontend/src/app/core/services/aula.service.ts)

## Descripción
Implementación de la eliminación segura de aulas con diagnóstico de impacto. Antes de proceder con el borrado físico, el sistema consulta las dependencias activas (exámenes programados) para advertir al Administrador sobre las consecuencias de la operación.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### GET `/aulas/:id/impacto`
Retorna el conteo de exámenes vinculados al aula.
#### DELETE `/aulas/:id`
Elimina físicamente el registro del aula de la base de datos MySQL.

### Lógica de Negocio
- **Diagnóstico**: El servicio está preparado para integrar `ExamenRepository` y cuantificar el impacto destructivo.
- **Integridad**: Se utiliza el método `remove()` de TypeORM para asegurar que el borrado sea atómico y respete las restricciones de clave foránea.

---

## Frontend

### Implementación
#### ListarAulasComponent
- **Flujo de Confirmación**: Se invoca a `verificarImpacto()` de forma asíncrona.
- **Diálogo Nativo**: Uso de `confirm()` con mensajes dinámicos que inyectan el número de dependencias encontradas.
- **Sincronización**: Refresco automático de la lista tras la confirmación de éxito del servidor.

---

## Testing

### Ejecución (cURL)
```bash
# Diagnóstico
curl http://localhost:3000/aulas/1/impacto

# Eliminación
curl -X DELETE http://localhost:3000/aulas/1
```
