# IdSw 2 > descargarCalendarioExamenes > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/descargarCalendarioExamenes/README.md)|[📐 Diseño](/RUP/02-diseño/casos-uso/descargarCalendarioExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [consultar-calendario.component.ts](/src/frontend/src/app/features/calendario/consultar-calendario/consultar-calendario.component.ts) · [consultar-calendario.component.html](/src/frontend/src/app/features/calendario/consultar-calendario/consultar-calendario.component.html) · [examen.service.ts](/src/frontend/src/app/core/services/examen.service.ts)

## Descripción

Implementación de la exportación y descarga física del calendario de exámenes en formatos PDF y Excel (.xlsx) con filtros personalizados de rango temporal y campos a incluir (aula, profesor, grado), heredando las políticas de visibilidad de datos del usuario logueado.

## Estado

✅ **Terminado** - Iteración 3

## Estructura del Módulo de Exportación (Strategy & Factory Patterns)

Para aislar la lógica de formateo de archivos del resto de la aplicación y garantizar que no haya efectos secundarios (mutaciones) en las entidades de base de datos (`Examen`), se implementó la exportación mediante el **Patrón Strategy** alimentado por un DTO plano e inmutable:

1. **`ExamenExportData` DTO** ([examen-exporter.interface.ts](/src/backend/src/modules/examenes/services/exporters/examen-exporter.interface.ts)): Interface plana que define los campos de exportación con la palabra clave `readonly`.
2. **`ExamenExporter`** ([examen-exporter.interface.ts](/src/backend/src/modules/examenes/services/exporters/examen-exporter.interface.ts)): Interfaz base de las estrategias de exportación.
3. **`ExcelExporterService`** ([excel-exporter.service.ts](/src/backend/src/modules/examenes/services/exporters/excel-exporter.service.ts)): Estrategia para exportar a Excel utilizando `xlsx`.
4. **`PdfExporterService`** ([pdf-exporter.service.ts](/src/backend/src/modules/examenes/services/exporters/pdf-exporter.service.ts)): Estrategia para exportar a PDF utilizando `pdfkit`.
5. **`ExamenExporterFactory`** ([exporter.factory.ts](/src/backend/src/modules/examenes/services/exporters/exporter.factory.ts)): Fábrica que provee la estrategia correspondiente según el formato recibido.

## Backend (NestJS)

### Nuevos Métodos y Rutas

#### 1. Endpoint `GET /examenes/exportar`
Controlador: [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts)
- Consume `fechaInicio`, `fechaFin`, `gradoId`, `asignaturaId`, `rol`, `email`, `formato` y flags de visibilidad.
- Llama a `findCalendario` con los criterios de filtrado y visibilidad.
- Aplanea las entidades de base de datos a `ExamenExportData[]` para blindar la capa de datos.
- Invoca la fábrica `ExamenExporterFactory.getExporter(formato)` y delega la generación del archivo.
- Retorna el buffer con la cabecera `Content-Type` correspondiente y `Content-Disposition: attachment`.


---

## Frontend (Angular)

### Implementación

#### 1. `ExamenService`
Archivo: [examen.service.ts](/src/frontend/src/app/core/services/examen.service.ts)
- Método `obtenerUrlExportacion(params: any): string` que construye la URL completa del endpoint de exportación con sus QueryParams.

#### 2. Diálogo Modal de Descarga
Se diseña un modal interactivo dentro de `ConsultarCalendarioComponent` que se activa al hacer clic en "Descargar Calendario".
- Permite seleccionar el formato (PDF / Excel).
- Rango de fechas por defecto alineado con el periodo de visualización actual.
- Opciones de visualización (Aula, Profesor, Grado).
- Al confirmar, genera un elemento `<a>` temporal en el DOM, asigna el enlace del endpoint de exportación y emite un evento `.click()`, forzando la descarga del archivo nativo y cerrando el diálogo.

---

## Pruebas de Desarrollo

### Endpoint de Exportación a Excel
```bash
curl -o calendario.xlsx "http://localhost:3000/examenes/exportar?formato=excel&fechaInicio=2026-06-01&fechaFin=2026-06-12"
```

### Endpoint de Exportación a PDF
```bash
curl -o calendario.pdf "http://localhost:3000/examenes/exportar?formato=pdf&fechaInicio=2026-06-01&fechaFin=2026-06-12"
```
