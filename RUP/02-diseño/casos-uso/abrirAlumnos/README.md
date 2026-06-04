# IdSw 2 > abrirAlumnos > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `abrirAlumnos()`, especificando el flujo de consulta paginada y la estructura de datos necesaria para visualizar el censo de estudiantes, incluyendo su vinculación con los Grados académicos.

## diagrama de secuencia

<div align=center>

|![Diseño: abrirAlumnos()](/images/02-diseño/casos-uso/abrirAlumnos/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/abrirAlumnos/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `GET`
- **Ruta**: `/alumnos`
- **Query Params**:
    - `page`: number (default: 1)
    - `limit`: number (default: 10)
    - `search`: string (opcional)

#### PagedResultDto<AlumnoDto>
```typescript
class PagedResultDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class AlumnoDto {
    id: number;
    matricula: string;
    nombre: string;
    email: string;
    curso: number; // Nivel (1º, 2º, 3º...)
    grado: {
        id: number;
        nombre: string;
    };
}
```

### Frontend (Angular)

#### AlumnoApiService
- `listar(page: number, search?: string): Observable<PagedResultDto<AlumnoDto>>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ListarAlumnosView` | `AlumnoListComponent` | Presentación del listado paginado y gestión de la selección múltiple. |
| `AlumnoController` | `AlumnoController` | Exposición de la API REST y validación de parámetros de consulta. |
| `AlumnoController` | `AlumnoService` | Orquestación de la consulta con joins hacia la entidad `Grado`. |
| `AlumnoRepository` | `AlumnoRepository` | Ejecución de `findAndCount()` sobre la base de datos MySQL. |
