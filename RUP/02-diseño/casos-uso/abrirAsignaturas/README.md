# IdSw 2 > abrirAsignaturas > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirAsignaturas/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/abrirAsignaturas/README.md)|Pruebas|

> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `abrirAsignaturas()`, especificando el flujo de consulta paginada y el mapeo de la relación con la entidad `Grado` para su correcta visualización en el listado administrativo.

## diagrama de secuencia

<div align=center>

|![Diseño: abrirAsignaturas()](/images/02-diseño/casos-uso/abrirAsignaturas/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/abrirAsignaturas/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `GET`
- **Ruta**: `/asignaturas`
- **Query Params**:
    - `page`: number (default: 1)
    - `limit`: number (default: 10)
    - `search`: string (opcional)

#### PagedResultDto<AsignaturaDto>
```typescript
class PagedResultDto<T> {
    data: T[];
    total: number;
    page: number;
    lastPage: number;
}

class AsignaturaDto {
    id: number;
    codigo: string;
    nombre: string;
    nivel: number;
    grado: {
        id: number;
        nombre: string;
    };
    cursoAcademico: {
        id: number;
        nombre: string;
    };
}
```

### Frontend (Angular)

#### AsignaturaApiService
- `listar(page: number, search?: string): Observable<PagedResultDto<AsignaturaDto>>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `Asignaturas Abierta` | `AsignaturaListComponent` | Gestión del estado del listado y llamadas al servicio de API. |
| `AsignaturaController` | `AsignaturaController` | Manejo de query params y delegación al servicio de negocio. |
| `AsignaturaController` | `AsignaturaService` | Construcción del `QueryBuilder` con joins para la entidad `Grado`. |
| `AsignaturaRepository` | `AsignaturaRepository` | Ejecución de `findAndCount()` sobre la base de datos MySQL. |
