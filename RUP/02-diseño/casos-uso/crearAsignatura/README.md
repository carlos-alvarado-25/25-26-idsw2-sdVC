# IdSw 2 > crearAsignatura > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearAsignatura/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/crearAsignatura/README.md)|Pruebas|

> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `crearAsignatura()`, aplicando el patrón "El Delgado" para una creación rápida y la redirección automática al estado singular de edición, asegurando la integridad referencial con la entidad `Grado` y asignando el curso correspondiente.

## diagrama de secuencia

<div align=center>

|![Diseño: crearAsignatura()](/images/02-diseño/casos-uso/crearAsignatura/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/crearAsignatura/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/asignaturas`

#### CreateAsignaturaDto
```typescript
class CreateAsignaturaDto {
    codigo: string;
    nombre: string;
    creditos: number;
    curso: number;
    gradoId: number;
}
```

### Frontend (Angular)

#### AsignaturaApiService
- `crear(dto: CreateAsignaturaDto): Observable<AsignaturaDto>`

#### Navegación
Tras la creación exitosa (HTTP 201), el componente redirige mediante `router.navigate(['/asignaturas/edit', id])`.

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `CrearAsignaturaView` | `AsignaturaFormComponent` | Captura de datos iniciales y gestión de la transición. |
| `AsignaturaController` | `AsignaturaController` | Validación de DTO y orquestación del alta. |
| `AsignaturaController` | `AsignaturaService` | Comprobación de unicidad de código y vinculación con `Grado`. |
| `AsignaturaRepository` | `AsignaturaRepository` | Inserción en MySQL y retorno de la entidad persistida. |
