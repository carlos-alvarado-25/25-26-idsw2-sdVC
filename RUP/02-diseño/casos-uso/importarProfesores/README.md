# IdSw 2 > importarProfesores > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarProfesores/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/importarProfesores/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `importarProfesores()`, especificando el flujo de procesamiento masivo de archivos CSV y Excel (.xlsx) reutilizando el motor modular `FileParserFactory` (Patrón Estrategia), aplicando el saneamiento automático de celdas (`trim`), la validación de unicidad de emails y códigos, la resolución de conflictos de correos electrónicos y la creación de credenciales de usuario correspondientes.

## diagrama de secuencia

<div align=center>

|![Diseño: importarProfesores()](/images/02-diseño/casos-uso/importarProfesores/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/importarProfesores/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/profesores/importar`
- **Content-Type**: `multipart/form-data`

#### Estructura del Archivo (CSV / Excel)
| Columna / Cabecera | Descripción | Tipo |
|--------------------|-------------|------|
| `codigo` | Identificador único del docente | String |
| `nombre` | Nombre completo del profesor | String |
| `email` | Correo electrónico del docente | String |
| `departamento` | Departamento académico asociado | String |

*Nota: Siguiendo las directrices del motor SOLID, los archivos CSV se procesarán de forma posicional sin cabeceras, mientras que los archivos Excel (.xlsx) requerirán cabeceras coincidentes.*

#### ImportResultDto
```typescript
class ImportResultDto {
    exitos: number;
    fallos: number;
    detalles: string[]; // Mensajes de error por fila o generales
}
```

### Frontend (Angular)

#### ProfesorApiService
- `importar(file: File): Observable<ImportResultDto>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ImportarProfesoresView` | `ProfesorImportComponent` | Interfaz de selección de archivo y renderizado de resultados. |
| `ProfesorController` | `ProfesorController` | Intercepción del archivo multipart y mapeado de la petición HTTP. |
| `ProfesorController` | `ProfesorService` | Orquestación del motor de parsing, lógica de resolución de emails duplicados mediante `resolveUniqueEmail()` e inserción en lote. |
| `UsuarioRepository` | `UsuarioRepository` (TypeORM) | Creación de credenciales asociadas para cada profesor importado en una transacción atómica aislada. |
| `ProfesorRepository` | `ProfesorRepository` | Verificación de unicidad de código, asociación con la FK `usuarioId` y persistencia en base de datos. |

## referencias

- [Análisis: importarProfesores](/RUP/01-analisis/casos-uso/importarProfesores/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
