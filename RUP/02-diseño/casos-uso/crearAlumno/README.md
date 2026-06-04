# IdSw 2 > crearAlumno > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearAlumno/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `crearAlumno()`, aplicando el patrón "El Delgado" para una creación ágil y la redirección automática al estado singular de edición, asegurando la integridad referencial con la entidad `Grado` y la unicidad de la matrícula.

## diagrama de secuencia

<div align=center>

|![Diseño: crearAlumno()](/images/02-diseño/casos-uso/crearAlumno/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/crearAlumno/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/alumnos`

#### CreateAlumnoDto
```typescript
class CreateAlumnoDto {
    matricula: string;
    nombre: string;
    email: string;
    curso: number;
    gradoId: number;
}
```

### Frontend (Angular)

#### AlumnoApiService
- `crear(dto: CreateAlumnoDto): Observable<AlumnoDto>`

#### Navegación
Tras la recepción de un HTTP 201, el sistema redirige mediante `router.navigate(['/admin/alumnos/editar', id])`.

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `CrearAlumnoView` | `AlumnoFormComponent` | Captura de datos iniciales y gestión de la transición a edición. |
| `AlumnoController` | `AlumnoController` | Validación del DTO y orquestación del alta. |
| `AlumnoController` | `AlumnoService` | Verificación de unicidad de matrícula y vinculación con `Grado`. |
| `GradoRepository` | `GradoRepository` | Validación de existencia de la titulación asociada. |
| `AlumnoRepository` | `AlumnoRepository` | Inserción en la base de datos MySQL y generación de ID. |
