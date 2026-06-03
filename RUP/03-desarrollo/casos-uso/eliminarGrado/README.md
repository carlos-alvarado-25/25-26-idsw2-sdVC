# IdSw 2 > eliminarGrado > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarGrado/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/eliminarGrado/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts)
- **Frontend:** [listar-grados.component.ts](/src/frontend/src/app/features/admin/grados/listar-grados/listar-grados.component.ts)

## Descripción
Implementación del borrado seguro de grados con verificación previa de impacto en asignaturas vinculadas.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/grados/:id/impacto`
Retorna el número de dependencias vinculadas al grado.

#### DELETE `/grados/:id`
Elimina físicamente el grado de MySQL.

## Frontend

### Implementación

#### ListarGradosComponent
- **Confirmación Informada**: Uso de cuadros de diálogo que integran el conteo de dependencias para mitigar borrados accidentales.
- **Refresco Reactivo**: Actualización automática de la señal de listado tras el éxito de la eliminación.

---

## Testing

### Backend (cURL)
```bash
# Verificar impacto
curl http://localhost:3000/grados/1/impacto

# Eliminar
curl -X DELETE http://localhost:3000/grados/1
```
