# IdSw 2 > importarAsignaturas > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarAsignaturas/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/importarAsignaturas/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `importarAsignaturas()`, especificando la interacción técnica entre los componentes de Angular y NestJS, el protocolo de transferencia de archivos y la lógica de validación de integridad referencial con la entidad `Grado`.

## diagrama de secuencia

<div align=center>

|![Diseño: importarAsignaturas()](/images/02-diseño/casos-uso/importarAsignaturas/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/importarAsignaturas/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/asignaturas/importar`
- **Content-Type**: `multipart/form-data`

#### Estructura del Archivo (CSV)
| Columna | Descripción | Tipo |
|---------|-------------|------|
| `codigo` | Código único de la asignatura | String |
| `nombre` | Nombre de la asignatura | String |
| `creditos` | Número de créditos ECTS | Number |
| `grado_codigo` | Código del Grado asociado | String |

#### ImportResultDto
```typescript
class ImportResultDto {
    procesados: number;
    exitosos: number;
    fallidos: number;
    errores: { fila: number, mensaje: string }[];
}
```

### Frontend (Angular)

#### AsignaturaApiService
- `importar(file: File): Observable<ImportResultDto>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ImportarAsignaturasView` | `ImportarAsignaturasComponent` | Gestión de la UI y carga de archivo mediante `FormData`. |
| `AsignaturaController` | `AsignaturaController` | Orquestación de la petición multipart y manejo de `Multer`. |
| `AsignaturaController` | `AsignaturaService` | Delegación del parsing al `ExcelParserService` y orquestación de la lógica de negocio y resolución de `grado_codigo` via `GradoRepository`. |
| `AsignaturaRepository` | `AsignaturaRepository` | Inserción atómica del lote mediante `save()`. |
