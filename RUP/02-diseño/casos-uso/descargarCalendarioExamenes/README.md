# IdSw 2 > descargarCalendarioExamenes > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/descargarCalendarioExamenes/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Gemini CLI

## propósito

Realización técnica del caso de uso `descargarCalendarioExamenes()`. Permite a los tres actores del sistema (Administrador, Profesor y Alumno) exportar los exámenes programados en formatos PDF y Excel (.xlsx) respetando los criterios de visibilidad por rol y proporcionando opciones avanzadas de personalización del contenido a incluir.

## diagrama de secuencia

<div align=center>

|![Diseño: descargarCalendarioExamenes()](/images/02-diseño/casos-uso/descargarCalendarioExamenes/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/descargarCalendarioExamenes/secuencia.puml)|

</div>

## clases de diseño identificadas

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| ConsultarCalendarioView | `ConsultarCalendarioComponent` (Angular) | - |
| - | `DescargarCalendarioModalComponent` (Angular - Modal) | - |
| - | `ExamenService` (Angular) — método `descargarCalendario` | - |
| - | - | `ExamenController` (NestJS) — método `exportar` |
| - | - | `ExamenService` (NestJS) — métodos `exportarExcel` y `exportarPdf` |
| ExamenRepository | - | `ExamenRepository` (TypeORM) |

## especificación de contratos y endpoints

### Backend (NestJS)

- **Endpoint**: `GET /examenes/exportar`
- **Query Parameters**:
  - `fechaInicio`: `string` (opcional, filtro fecha inicio)
  - `fechaFin`: `string` (opcional, filtro fecha fin)
  - `gradoId`: `number` (opcional, filtro de grado)
  - `asignaturaId`: `number` (opcional, filtro de asignatura)
  - `rol`: `string` (rol del usuario obtenido del token JWT)
  - `email`: `string` (email del usuario obtenido del token JWT)
  - `formato`: `string` ('pdf' | 'excel', obligatorio)
  - `incluirAula`: `boolean` (indica si se incluye la columna Aula, por defecto `true`)
  - `incluirProfesor`: `boolean` (indica si se incluye la columna Profesor, por defecto `true`)
  - `incluirGrado`: `boolean` (indica si se incluye la columna Grado, por defecto `true`)

- **Respuestas**:
  - `200 OK` con archivo binario adjunto (`Content-Disposition: attachment`).
    - Para `formato=excel`: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, nombre de archivo `calendario.xlsx`.
    - Para `formato=pdf`: `Content-Type: application/pdf`, nombre de archivo `calendario.pdf`.

---

## detalles de implementación técnica

### 1. Patrón Strategy y Control de Mutabilidad (ExamenExportData)
Para evitar efectos secundarios (mutaciones de estado) en las entidades de persistencia (`Examen`) y cumplir con el principio de **separación de capas (Clean Architecture)**, se introduce una estructura plana, inmutable y de solo lectura que actúa como DTO de exportación: **`ExamenExportData`**.

#### Definición de la Interfaz del Exportador (`ExamenExporter`)
```typescript
export interface ExamenExportData {
  readonly codigo: string;
  readonly fecha: string;
  readonly hora: string;
  readonly duracion: number;
  readonly tipo: string;
  readonly nombreAsignatura: string;
  readonly nombreGrado: string;
  readonly nombreAula: string;
  readonly nombreProfesor: string;
}

export interface ExportOptions {
  incluirAula: boolean;
  incluirProfesor: boolean;
  incluirGrado: boolean;
}

export interface ExamenExporter {
  exportar(datos: readonly ExamenExportData[], opciones: ExportOptions): Promise<Buffer>;
}
```

La fábrica **`ExamenExporterFactory`** se encarga de resolver la estrategia concreta a ejecutar (`ExcelExporterService` o `PdfExporterService`) según el parámetro `formato`. De este modo:
1. **Los exportadores están totalmente desacoplados de la persistencia (TypeORM)**, actuando como clases formateadoras puras.
2. **Inmutabilidad Absoluta**: Gracias a `readonly` y `readonly ExamenExportData[]`, TypeScript impide que los exportadores modifiquen los datos del calendario.
3. **Escalabilidad**: Se pueden añadir nuevos formatos (ej: `.docx` o `.csv`) implementando la interfaz `ExamenExporter` y registrando el nuevo servicio en la fábrica, sin tocar el controlador ni los servicios de negocio principales.

### 2. Formato Excel (SheetJS)
Para generar el archivo Excel en el backend de forma ligera y sin dependencias externas pesadas, se utiliza la librería `xlsx`. El servicio mapea la lista de exámenes a un array de objetos JSON que representan las columnas y filas, ajustando el ancho de columna automáticamente según el contenido máximo de cada campo.

### 2. Formato PDF (PDFKit)
Se utiliza `pdfkit` para la generación programática de documentos PDF en formato tabla de alta definición. Se implementa:
- Salto de página automático (`doc.addPage()`) con reimpresión de cabeceras de columna cuando el cursor supera los 700 puntos verticales.
- Control de desbordamiento horizontal y truncamiento inteligente de textos (ej. nombres de asignaturas largos).
- Cabecera y fecha de generación del reporte en tiempo real.

### 3. Descarga en el Frontend (Angular)
El frontend invoca el endpoint de exportación mediante una redirección directa o creando un objeto `URL` dinámico y un elemento de anclaje virtual `<a>` para simular la descarga en el navegador. Esto evita problemas de consumo de memoria al descargar archivos binarios de gran tamaño mediante peticiones AJAX standard.

## referencias

- [Análisis: descargarCalendarioExamenes()](/RUP/01-analisis/casos-uso/descargarCalendarioExamenes/README.md)
- [Caso de Uso Base: consultarCalendario()](/RUP/02-diseño/casos-uso/consultarCalendario/README.md)
