# IdSw 2 > editarAlumno > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarAlumno/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-04
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `editarAlumno()`, estableciendo el flujo de actualización incremental mediante el método `PATCH` y la gestión del estado singular de edición para optimizar la eficiencia operativa del Administrador en la gestión de perfiles de estudiantes.

## diagrama de secuencia

<div align=center>

|![Diseño: editarAlumno()](/images/02-diseño/casos-uso/editarAlumno/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/editarAlumno/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoints
1. **Carga**: `GET /alumnos/:id` -> Retorna `AlumnoDto`.
2. **Actualización**: `PATCH /alumnos/:id` -> Recibe `UpdateAlumnoDto`.

#### UpdateAlumnoDto
```typescript
class UpdateAlumnoDto {
    nombre?: string;
    email?: string;
    curso?: number;
    gradoId?: number;
}
```

### Frontend (Angular)

#### AlumnoApiService
- `obtener(id: number): Observable<AlumnoDto>`
- `actualizar(id: number, dto: UpdateAlumnoDto): Observable<void>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EditarAlumnoView` | `AlumnoFormComponent` | Gestión del estado singular de edición y persistencia incremental. |
| `AlumnoController` | `AlumnoController` | Manejo de peticiones de recuperación y actualización parcial. |
| `AlumnoController` | `AlumnoService` | Orquestación de la actualización en el dominio y validación de existencia del grado si cambia. |
| `AlumnoRepository` | `AlumnoRepository` | Sincronización de cambios en la base de datos MySQL mediante `update()`. |
| `GradoRepository` | `GradoRepository` | Validación de existencia de la nueva titulación asignada. |
