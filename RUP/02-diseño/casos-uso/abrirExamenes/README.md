# IdSw 2 > abrirExamenes > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `abrirExamenes()`, especificando el flujo de consulta paginada y la estructura de datos del DTO de Examen para la visualización del calendario académico de evaluaciones.

## diagrama de secuencia

<div align=center>

|![Diseño: abrirExamenes()](/images/02-diseño/casos-uso/abrirExamenes/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/abrirExamenes/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `GET`
- **Ruta**: `/examenes`
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  
- **Método**: `GET`
- **Ruta**: `/examenes/search`
- **Query Params**:
  - `q`: string (criterio de búsqueda parcial)
  - `page`: number (default: 1)

#### PagedResultDto<ExamenDto>
```typescript
class PagedResultDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class ExamenDto {
    id: number;
    fecha: string; // Formato YYYY-MM-DD
    hora: string;  // Turno u hora (ej: "09:00", "16:00")
    tipo: string;  // "Ordinaria" o "Extraordinaria"
    asignatura: {
        id: number;
        codigo: string;
        nombre: string;
        creditos: number;
    };
    aula: {
        id: number;
        codigo: string;
        nombre: string;
        capacidad: number;
    } | null;
    profesor: {
        id: number;
        codigo: string;
        nombre: string;
        departamento: string;
    } | null;
}
```

### Frontend (Angular)

#### ExamenService
- `listar(page: number): Observable<PagedResult<Examen>>`
- `filtrar(criterio: string, page: number): Observable<PagedResult<Examen>>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ListarExamenesView` | `ListarExamenesComponent` (Angular) | Presentación del listado paginado del calendario de exámenes. |
| `ExamenController` | `ExamenController` (NestJS) | Exposición de la API REST de consulta y filtrado de exámenes. |
| `ExamenController` | `ExamenService` (NestJS) | Orquestación de la consulta paginada de evaluaciones. |
| `ExamenRepository` | `ExamenRepository` (TypeORM) | Ejecución de `findAndCount()` sobre MySQL con `leftJoin` en relaciones. |
| `Examen` | `Examen` (Entity / Interface) | Representación física del modelo de datos de un Examen. |

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirExamenes](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)
