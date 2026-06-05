# IdSw 2 > crearExamen > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearExamen/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/crearExamen/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-05
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `crearExamen()`, aplicando el patrón "El Delgado" para una creación ágil y la redirección automática al estado singular de edición de examen, garantizando la integridad de datos referenciales con la entidad `Asignatura` y la unicidad del código de examen.

## diagrama de secuencia

<div align=center>

|![Diseño: crearExamen()](/images/02-diseño/casos-uso/crearExamen/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/crearExamen/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/examenes`

#### CrearExamenDto
```typescript
class CrearExamenDto {
    codigo: string;       // Código único identificativo (ej: "EX-MAT1-2026")
    fecha: string;        // Formato YYYY-MM-DD
    hora: string;         // Formato HH:MM (ej: "09:00", "16:00")
    duracion: number;     // Duración en minutos (ej: 120)
    tipo: string;         // Tipo de examen: "Ordinaria" | "Extraordinaria"
    asignaturaId: number; // ID de la asignatura asociada
}
```

- **Respuesta Exitosa**: `201 Created` + `ExamenDto` (incluye el ID autogenerado por la base de datos).
- **Validaciones**:
  * `codigo`: Requerido, único en el sistema, tipo string.
  * `fecha`: Requerida, formato de fecha válido (YYYY-MM-DD).
  * `hora`: Requerida, formato de hora válido (HH:MM).
  * `duracion`: Requerida, entero positivo.
  * `tipo`: Requerido, debe ser uno de los valores válidos: "Ordinaria" o "Extraordinaria".
  * `asignaturaId`: Requerida, número entero.

### Frontend (Angular)

#### ExamenApiService
- `crear(dto: CrearExamenDto): Observable<ExamenDto>`

#### Navegación (Patrón El Delgado)
Tras la recepción de la respuesta exitosa con código HTTP `201 Created`, el frontend (`ExamenFormComponent`) utiliza el enrutador de Angular para redirigir automáticamente al administrador a la vista de edición avanzada: `/admin/examenes/editar/:id`.
Esto permite continuar con la asignación de aulas y supervisores (profesores) sobre el examen recién programado sin sobrecargar el formulario inicial.

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `CrearExamenView` | `ExamenFormComponent` (Angular) | Captura de datos iniciales y gestión de la transición a edición. |
| - | `ExamenApiService` (Angular) | Comunicación HTTP con el backend NestJS. |
| `ExamenController` | `ExamenController` (NestJS) | Exposición del endpoint `POST /examenes` y validación de DTO. |
| - | `ExamenService` (NestJS) | Verificación de unicidad de código y existencia de asignatura. |
| `AsignaturaRepository` | `AsignaturaRepository` (TypeORM) | Verificación de existencia de la asignatura asociada. |
| `ExamenRepository` | `ExamenRepository` (TypeORM) | Persistencia física y consulta de unicidad del código. |
| `Examen` | `Examen` (Entity / MySQL) | Representación en la base de datos MySQL. |

## referencias

- [Análisis: crearExamen](/RUP/01-analisis/casos-uso/crearExamen/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
