# IdSw 2 > importarAlumnos > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarAlumnos/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/importarAlumnos/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts)
- **Frontend:** [importar-alumnos.component.ts](/src/frontend/src/app/features/admin/alumnos/importar-alumnos/importar-alumnos.component.ts) · [alumno.service.ts](/src/frontend/src/app/core/services/alumno.service.ts)

## Descripción
Implementación de la carga masiva de alumnos mediante archivos CSV y Excel (.xlsx). El sistema utiliza el motor de infraestructura unificado para procesar los datos, asegurando la integridad referencial con los Grados, la creación transaccional de credenciales de usuario y la resolución dinámica de emails en conflicto.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/alumnos/importar`
Procesa un archivo multipart/form-data. Soporta CSV y XLSX.
- **Formato**: `matricula, nombre, email, curso, grado_codigo`.

### Lógica de Negocio
- **Motor Multi-formato**: Uso de `FileParserFactory` para abstraer el origen del dato.
- **Validación de Identidad**: Comprobación de que la matrícula no exista previamente.
- **Resolución Académica**: Mapeo dinámico de `grado_codigo` a la clave primaria de la tabla Grado.
- **Aislamiento Transaccional por Fila**: Cada fila es importada dentro de un bloque `QueryRunner` transaccional. De este modo, si ocurre un error (e.g. matrícula duplicada), solo se revierte el registro afectado de esa fila sin interrumpir el procesamiento del resto del lote.
- **Creación de Credenciales**: Creación automática de un `Usuario` con rol `Alumno` y contraseña encriptada por defecto (`idsw2_2026`).
- **Resolución de Email Único**: Implementación de `resolveUniqueEmail()` para gestionar colisiones de correos electrónicos. Si el email ya está registrado, añade de forma incremental un sufijo numérico al nombre del buzón (ej: `alumno@idsw.edu` -> `alumno2@idsw.edu`), previniendo errores de restricción de clave única en la base de datos.

---

## Frontend

### Implementación
#### ImportarAlumnosComponent
- **Instrucciones Adaptativas**: Información clara sobre el uso de cabeceras según el formato.
- **Feedback Detallado**: Visualización de estadísticas de éxito y descripción de errores por fila.

---

## Testing

### Preparación del Archivo (alumnos.csv)
```csv
ALU101, Juan Pérez, juan@idsw.edu, 1, GINF
ALU102, María García, maria@idsw.edu, 2, GINF
```

### Ejecución (cURL)
```bash
curl -X POST http://localhost:3000/alumnos/importar \
  -F "file=@alumnos.csv"
```
