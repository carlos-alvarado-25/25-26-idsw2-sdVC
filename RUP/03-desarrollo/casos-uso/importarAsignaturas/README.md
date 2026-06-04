# IdSw 2 > importarAsignaturas > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarAsignaturas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/importarAsignaturas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts) · [import-result.dto.ts](/src/backend/src/modules/asignaturas/dto/import-result.dto.ts)
- **Frontend:** [importar-asignaturas.component.ts](/src/frontend/src/app/features/admin/asignaturas/importar-asignaturas/importar-asignaturas.component.ts) · [asignatura.service.ts](/src/frontend/src/app/core/services/asignatura.service.ts)

## Descripción
Implementación de la carga masiva de asignaturas mediante archivos CSV y Excel (.xlsx). El sistema procesa cada línea del archivo, validando la integridad referencial con la entidad `Grado` mediante su código único antes de persistir los datos.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/asignaturas/importar`
Procesa un archivo multipart/form-data.
- **Form-data key**: `file`.
- **Formato**: `codigo, nombre, creditos, grado_codigo`.

### Lógica de Negocio
- **Carga en Lote**: Uso de `repository.save()` con un array de entidades para optimizar la persistencia.
- **Resolución de Dependencias**: Mapeo dinámico de `grado_codigo` a `gradoId` consultando la base de datos de Grados.
- **Feedback Detallado**: Retorno de un `ImportResultDto` detallando el balance de éxitos y errores por cada fila.

---

## Frontend

### Implementación
#### ImportarAsignaturasComponent
- **Consistencia Visual**: Reutilización de los estilos definidos en el ramillete de Grados para garantizar una UX cohesiva.
- **Manejo de Archivos**: Uso de `FormData` para la transferencia binaria del archivo al servidor.
- **Visualización de Resultados**: Panel reactivo que muestra el conteo de registros procesados y una lista de errores específicos si ocurrieran.

---

## Testing

### Preparación del Archivo (test.csv)
```csv
codigo, nombre, creditos, grado_codigo
ALG001, Álgebra, 6, GINF
CAL002, Cálculo I, 6, GINF
```

### Ejecución (cURL)
```bash
curl -X POST http://localhost:3000/asignaturas/importar \
  -F "file=@test.csv"
```
