# IdSw 2 > importarGrados > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarGrados/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/importarGrados/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts) · [import-result.dto.ts](/src/backend/src/modules/grados/dto/import-result.dto.ts)
- **Frontend:** [importar-grados.component.ts](/src/frontend/src/app/features/admin/grados/importar-grados/importar-grados.component.ts) · [grado.service.ts](/src/frontend/src/app/core/services/grado.service.ts)

## Descripción
Implementación de la carga masiva de grados mediante archivos CSV. El sistema parsea el archivo, valida la integridad de cada registro y realiza una persistencia atómica por lote.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/grados/importar`
Procesa un archivo multipart y retorna el balance de la operación.
- **Payload**: `file` (Multipart)
- **Respuesta**: `ImportResultDto` { exitos, fallos, detalles }

### Implementación
- **Multer**: Configurado para capturar archivos en memoria (`FileInterceptor`).
- **Parsing**: Lógica de segmentación por saltos de línea y comas, con validación de cabeceras.
- **Batch Save**: Uso del repositorio de TypeORM para insertar el lote completo en una sola transacción.

---

## Frontend

### Implementación

#### ImportarGradosComponent
- **File API**: Captura del archivo mediante input nativo.
- **FormData**: Construcción del objeto multipart para el envío asíncrono.
- **Dashboard de Resultados**: Visualización cuantitativa (éxitos/fallos) y lista detallada de errores de validación.

---

## Testing

### Preparación (archivo.csv)
```csv
codigo, nombre, descripcion
MAT, Grado en Matemáticas, Ciencias Puras
FIS, Grado en Física, 
```

### Ejecución
1. Navegar a /admin/grados/importar.
2. Seleccionar el archivo CSV.
3. Pulsar "Iniciar Importación".
4. Verificar estadísticas en pantalla y refresco del listado general.

## Notas de implementación
- La lógica de parsing es resiliente a líneas vacías y espacios en blanco.
- Los códigos duplicados no interrumpen el proceso; se informan individualmente en los detalles.
