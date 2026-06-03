# IdSw 2 > importarAulas > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarAulas/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/importarAulas/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-04
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `importarAulas()`, especificando el flujo de procesamiento masivo de archivos CSV, la validación de unicidad de los recursos físicos y la estructura de reporte de resultados.

## diagrama de secuencia

<div align=center>

|![Diseño: importarAulas()](/images/02-diseño/casos-uso/importarAulas/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/importarAulas/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/aulas/importar`
- **Content-Type**: `multipart/form-data`

#### Estructura del Archivo (CSV)
| Columna | Descripción | Tipo |
|---------|-------------|------|
| `codigo` | Identificador único del aula | String |
| `nombre` | Nombre descriptivo | String |
| `capacidad` | Aforo máximo | Number |
| `edificio` | Nombre del edificio | String |
| `planta` | Nivel de ubicación | String |
| `tipo` | Categoría (Teoría, Lab, etc.) | String |

#### ImportResultDto
```typescript
class ImportResultDto {
    exitos: number;
    fallos: number;
    detalles: string[]; // Mensajes de error por fila
}
```

### Frontend (Angular)

#### AulaApiService
- `importar(file: File): Observable<ImportResultDto>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ImportarAulasView` | `ImportarAulasComponent` | Gestión de la carga de archivos y muestreo de estadísticas. |
| `AulaController` | `AulaController` | Gestión de la petición multipart y orquestación del proceso. |
| `AulaController` | `AulaService` | Parsing del CSV, validación de reglas de negocio y carga en lote. |
| `AulaRepository` | `AulaRepository` | Persistencia masiva en MySQL mediante `save()`. |
