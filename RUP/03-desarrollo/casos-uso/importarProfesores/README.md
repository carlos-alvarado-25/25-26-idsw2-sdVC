# IdSw 2 > importarProfesores > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarProfesores/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/importarProfesores/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts) · [profesor.entity.ts](/src/backend/src/entities/profesor.entity.ts)
- **Frontend:** [importar-profesores.component.ts](/src/frontend/src/app/features/admin/profesores/importar-profesores/importar-profesores.component.ts) · [profesor.service.ts](/src/frontend/src/app/core/services/profesor.service.ts)

## Descripción
Implementación de la importación masiva de profesores. Permite cargar lotes de datos desde archivos en formatos CSV o Excel (.xlsx) de manera atómica, aplicando validaciones de duplicados de código o email y saneamiento del texto.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/profesores/importar`
Recibe el archivo mediante multipart/form-data y ejecuta la importación.
- **Payload**: `file` (Buffer binario del archivo).
- **Respuesta**: `201 Created` + `ImportResultDto`.

### Implementación
- **Motor Multi-formato (SOLID)**: Reutilización de la infraestructura compartida `FileParserFactory`, delegando la lectura al `CsvParserService` o `ExcelParserService` correspondientes según el mimetype del archivo.
- **Validaciones de Lote**: Comprueba en base de datos la no existencia del código de profesor y del correo electrónico antes de preparar la entidad. En caso de colisión o datos vacíos, incrementa el conteo de fallos y detalla el motivo de forma amigable (`ImportResultDto`).
- **Persistencia en Bloque**: Los registros válidos se guardan atómicamente utilizando el repositorio de TypeORM.

---

## Frontend

### Implementación
#### ImportarProfesoresComponent
- **Instrucciones Adaptativas**: Detalla visualmente las diferencias del contrato: CSV posicional sin cabecera (mapeo estricto de columnas) y Excel con cabeceras explícitas (`codigo, nombre, email, departamento`).
- **Resumen e Indicadores**: Muestra un cuadro estadístico diferenciado de éxitos y fallos al finalizar la operación, complementado con una consola con scroll para examinar advertencias detalladas por fila.
- **Estética Cohesiva**: Hereda las clases utilitarias (`import-card`, `file-drop-area`, etc.) que configuran los flujos de carga masiva de los módulos de Grados y Alumnos.

---

## Testing

### Backend (cURL)
```bash
# Carga de archivo CSV
curl -X POST http://localhost:3000/profesores/importar \
  -F "file=@/ruta/al/archivo/profesores.csv"
```
