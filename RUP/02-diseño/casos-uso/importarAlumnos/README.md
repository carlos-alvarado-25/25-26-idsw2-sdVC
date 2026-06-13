# IdSw 2 > importarAlumnos > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarAlumnos/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/importarAlumnos/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `importarAlumnos()`, especificando el flujo de procesamiento masivo de archivos CSV y Excel (.xlsx), la resolución de integridad referencial con la entidad `Grado`, la validación de unicidad de matrículas estudiantiles, la resolución automática de conflictos de correos electrónicos y la creación de credenciales de usuario correspondientes.

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
| `AlumnoController` | `AlumnoService` | Delegación del parsing al `ExcelParserService`, resolución de `grado_codigo`, lógica de resolución de emails duplicados mediante `resolveUniqueEmail()` y orquestación del proceso de importación. |
| `UsuarioRepository` | `UsuarioRepository` (TypeORM) | Creación de credenciales asociadas para cada alumno importado en una transacción atómica aislada. |
| `GradoRepository` | `GradoRepository` | Validación de existencia de las titulaciones académicas referenciadas. |
| `AlumnoRepository` | `AlumnoRepository` | Verificación de unicidad de matrícula, asociación con la FK `usuarioId` y persistencia en base de datos. |
