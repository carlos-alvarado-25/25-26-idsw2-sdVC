# IdSw 2 > abrirProfesores > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirProfesores/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/abrirProfesores/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-04
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `abrirProfesores()`, especificando el flujo de consulta paginada y la estructura de datos necesaria para visualizar el personal docente de la institución.

## diagrama de secuencia

<div align=center>

|![Diseño: abrirProfesores()](/images/02-diseño/casos-uso/abrirProfesores/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/abrirProfesores/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `GET`
- **Ruta**: `/profesores`
- **Query Params**:
    - `page`: number (default: 1)
    - `limit`: number (default: 10)
    - `search`: string (opcional)

#### PagedResultDto<ProfesorDto>
```typescript
class PagedResultDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class ProfesorDto {
    id: number;
    codigo: string;
    nombre: string;
    email: string;
    departamento: string;
    asignaturas: {
        id: number;
        nombre: string;
    }[];
}
```

### Frontend (Angular)

#### ProfesorApiService
- `listar(page: number, search?: string): Observable<PagedResultDto<ProfesorDto>>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ListarProfesoresView` | `ProfesorListComponent` | Presentación del listado paginado y gestión de la selección múltiple. |
| `ProfesorController` | `ProfesorController` | Exposición de la API REST y validación de parámetros de consulta. |
| `ProfesorController` | `ProfesorService` | Orquestación de la consulta paginada. |
| `ProfesorRepository` | `ProfesorRepository` | Ejecución de `findAndCount()` sobre la base de datos MySQL. |
