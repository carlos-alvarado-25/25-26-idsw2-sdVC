# IdSw 2 > importarAlumnos > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarAlumnos/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-04
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `importarAlumnos()`, especificando el flujo de procesamiento masivo de archivos CSV, la resolución de integridad referencial con la entidad `Grado` y la validación de unicidad de matrículas estudiantiles.

## diagrama de secuencia

<div align=center>

|![Diseño: importarAlumnos()](/images/02-diseño/casos-uso/importarAlumnos/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/importarAlumnos/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/alumnos/importar`
- **Content-Type**: `multipart/form-data`

#### Estructura del Archivo (CSV)
| Columna | Descripción | Tipo |
|---------|-------------|------|
| `matricula` | Identificador académico único | String |
| `nombre` | Nombre completo del alumno | String |
| `email` | Correo electrónico institucional | String |
| `curso` | Nivel académico (1, 2, 3...) | Number |
| `grado_codigo` | Código del Grado asociado | String |

#### ImportResultDto
```typescript
class ImportResultDto {
    exitos: number;
    fallos: number;
    detalles: string[]; // Mensajes de error por fila
}
```

### Frontend (Angular)

#### AlumnoApiService
- `importar(file: File): Observable<ImportResultDto>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ImportarAlumnosView` | `ImportarAlumnosComponent` | Gestión de la carga de archivos y muestreo de estadísticas finales. |
| `AlumnoController` | `AlumnoController` | Gestión de la petición multipart y orquestación del proceso. |
| `AlumnoController` | `AlumnoService` | Parsing del CSV, resolución de `grado_codigo` y carga en lote. |
| `GradoRepository` | `GradoRepository` | Validación de existencia de las titulaciones académicas referenciadas. |
| `AlumnoRepository` | `AlumnoRepository` | Verificación de unicidad de matrícula y persistencia masiva en MySQL. |
