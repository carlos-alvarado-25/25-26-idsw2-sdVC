# IdSw 2 > importarProfesores > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarProfesores/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/importarProfesores/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts) · [profesor.entity.ts](/src/backend/src/entities/profesor.entity.ts)
- **Frontend:** [importar-profesores.component.ts](/src/frontend/src/app/features/admin/profesores/importar-profesores/importar-profesores.component.ts) · [profesor.service.ts](/src/frontend/src/app/core/services/profesor.service.ts)

## Descripción
Implementación de la importación masiva de profesores. Permite cargar lotes de datos desde archivos en formatos CSV o Excel (.xlsx), aplicando validaciones de duplicados de código, resolución automática de colisiones de correo electrónico (`resolveUniqueEmail()`) y creación transaccional aislada de credenciales de usuario por cada fila.

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
- **Transaccionalidad Aislada**: Cada fila del archivo se procesa dentro de una transacción (`QueryRunner` de TypeORM). Si una fila específica falla (e.g. código de docente duplicado en BD), se realiza rollback de esa fila particular, registrando el error en el DTO de resultados y permitiendo continuar con el procesamiento de las demás filas de manera atómica.
- **Creación de Credenciales**: Por cada profesor importado correctamente se genera un registro en la tabla `Usuario` con rol `Profesor` y una contraseña por defecto `idsw2_2026` cifrada mediante `bcrypt`, asociándolo con la FK `usuarioId` en una relación 1:1.
- **Resolución de Email Único**: Método `resolveUniqueEmail()` para prevenir conflictos de clave única en la base de datos de usuarios. Si el email ya está registrado, añade incrementalmente un sufijo numérico al alias del correo electrónico (ej: `profesor@idsw.edu` -> `profesor2@idsw.edu`).

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
