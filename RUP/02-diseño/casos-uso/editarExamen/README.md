# IdSw 2 > editarExamen > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarExamen/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/editarExamen/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboración (Elaboration)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `editarExamen()`, especificando el flujo de modificación incremental de datos de un examen, la validación de unicidad de código de examen y la detección de conflictos de solapamientos (tanto para el uso de aulas físicas como de profesores supervisores).

## diagrama de secuencia

<div align=center>

|![Diseño: editarExamen()](/images/02-diseño/casos-uso/editarExamen/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/editarExamen/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### 1. Obtener Detalle del Examen
- **Método**: `GET`
- **Ruta**: `/examenes/:id`
- **Respuesta**: `ExamenDto` con relaciones completas (`Asignatura`, `Aula`, `Profesor`).

#### 2. Modificar Examen (Actualización Parcial)
- **Método**: `PATCH`
- **Ruta**: `/examenes/:id`

#### UpdateExamenDto
```typescript
class UpdateExamenDto {
    codigo?: string;
    fecha?: string;            // Formato YYYY-MM-DD
    hora?: string;             // Formato HH:MM
    duracion?: number;         // En minutos
    tipo?: string;             // "Ordinaria" | "Extraordinaria"
    asignaturaId?: number;
    aulaId?: number | null;     // Permite desvincular o cambiar el aula
    profesorId?: number | null; // Permite desvincular o cambiar el profesor
}
```

- **Respuesta Exitosa**: `200 OK` + `ExamenDto` actualizado.
- **Validación de Reglas de Negocio (Conflictos)**:
  * **Unicidad del Código**: Si se modifica `codigo`, el `ExamenService` verifica mediante `ExamenRepository` que no esté registrado para otro examen. En caso de duplicidad, lanza `ConflictException` (HTTP 409).
  * **Conflicto de Aula (Solapamiento)**: Si se asigna o cambia `aulaId` (no nulo), el backend consulta en `ExamenRepository` si existe alguna coincidencia horaria con otro examen programado en la misma aula, el mismo día, cuyas franjas de tiempo (determinadas por `hora` y `duracion`) se solapen. Si se detecta cruce, lanza `ConflictException("El aula seleccionada ya está ocupada en esta franja horaria")`.
  * **Conflicto de Profesor (Solapamiento)**: Si se asigna o cambia `profesorId` (no nulo), se comprueba en `ExamenRepository` si el docente tiene algún otro examen programado cuyas franjas horarias se solapen. Si se detecta cruce, lanza `ConflictException("El profesor seleccionado ya supervisa otro examen en esta franja horaria")`.

### Frontend (Angular)

#### ExamenApiService
- `obtener(id: number): Observable<ExamenDto>`
- `actualizar(id: number, dto: UpdateExamenDto): Observable<ExamenDto>`

#### Flujo de Navegación en ExamenFormComponent
1. **Carga Inicial**: Al cargar en modo edición (detecta `id` en la ruta activa `/admin/examenes/editar/:id`), consume `obtener(id)` para rellenar el formulario reactivo.
2. **Carga de Opciones**: Descarga de forma asíncrona la lista de aulas disponibles y el buscador interactivo de asignaturas y profesores.
3. **Guardado**: Al enviar cambios con éxito, muestra una notificación toast y mantiene al Administrador en la vista para continuar realizando ajustes.
4. **Finalizar/Cancelar**: Navega de vuelta al listado general de exámenes en `/admin/examenes`.

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EditarExamenView` | `ExamenFormComponent` (Angular) | Formulario reactivo y visualización de datos actuales y opciones. |
| - | `ExamenApiService` (Angular) | Cliente HTTP para obtener y actualizar el examen. |
| `ExamenController` | `ExamenController` (NestJS) | Controladores REST (`GET /examenes/:id`, `PATCH /examenes/:id`). |
| - | `ExamenService` (NestJS) | Orquestación de validaciones y lógica de detección de solapamientos. |
| `ExamenRepository` | `ExamenRepository` (TypeORM) | Operaciones de persistencia y queries personalizadas de solapamiento. |
| `AsignaturaRepository` | `AsignaturaRepository` (TypeORM) | Validación de existencia y carga de asignatura vinculada. |
| `AulaRepository` | `AulaRepository` (TypeORM) | Validación de existencia y carga de aula vinculada. |
| `Examen` | `Examen` (Entity) | Modelo de datos físico de la tabla `Examen`. |

## referencias

- [Análisis: editarExamen](/RUP/01-analisis/casos-uso/editarExamen/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
