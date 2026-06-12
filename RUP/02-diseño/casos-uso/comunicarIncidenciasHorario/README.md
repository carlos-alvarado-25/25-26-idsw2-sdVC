# IdSw 2 > comunicarIncidenciasHorario > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/comunicarIncidenciasHorario/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/comunicarIncidenciasHorario/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-12
- **Autor**: Gemini CLI

## Propósito

Realización técnica detallada del caso de uso `comunicarIncidenciasHorario()` para la plataforma NestJS + Angular. Este diseño especifica cómo un Profesor reporta conflictos en los exámenes que tiene asignados, detallando los DTOs, endpoints de la API, y la interfaz de usuario reactiva en el Frontend.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: comunicarIncidenciasHorario()](/images/02-diseño/casos-uso/comunicarIncidenciasHorario/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/comunicarIncidenciasHorario/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| ComunicarIncidenciaView | ComunicarIncidenciaComponent (Angular) | - |
| - | IncidenciaService (Angular) | - |
| IncidenciaController | - | IncidenciasController (NestJS) |
| - | - | IncidenciasService (NestJS) |
| IncidenciaRepository | - | IncidenciaRepository (TypeORM) |
| Incidencia | - | Incidencia (Entity) |
| Examen | - | Examen (Entity) |
| Profesor | - | Profesor (Entity) |

## Detalles Técnicos

### 1. Modelo de Persistencia (Entidad `Incidencia`)
La tabla `Incidencia` se define con las siguientes columnas:
*   `id`: Clave primaria autoincremental (`INT`).
*   `tipo`: Cadena de texto (`VARCHAR(50)`). Valores válidos: 'Solapamiento de horarios', 'Preferencia horaria', 'Indisponibilidad', 'Otros'.
*   `descripcion`: Texto detallado (`TEXT`).
*   `evidencias`: Ruta o nombre de archivo adjunto (`VARCHAR(255)`, opcional).
*   `estado`: `ENUM('PENDIENTE', 'RESUELTA', 'RECHAZADA')` por defecto `'PENDIENTE'`.
*   `examenId`: FK relacionada con `Examen` (`ON DELETE CASCADE`).
*   `profesorId`: FK relacionada con `Profesor` (`ON DELETE CASCADE`).
*   `fechaCreacion` / `fechaActualizacion`: Timestamps automáticos.

### 2. Comunicación API
*   **Endpoint**: `POST /incidencias`
*   **Cuerpo (Request)**: `CrearIncidenciaDto`
    ```json
    {
      "examenId": 14,
      "tipo": "Solapamiento de horarios",
      "descripcion": "El examen coincide con mi ponencia de investigación programada el mismo día.",
      "evidencias": "evidencia_ponencia.pdf"
    }
    ```
*   **Respuesta Exitosa**: `201 Created` + Objeto `Incidencia` persistido.
*   **Validaciones (class-validator)**:
    *   `examenId`: `IsInt()`, `IsNotEmpty()`.
    *   `tipo`: `IsIn(['Solapamiento de horarios', 'Preferencia horaria', 'Indisponibilidad', 'Otros'])`.
    *   `descripcion`: `IsString()`, `MinLength(10)`, `IsNotEmpty()`.
    *   `evidencias`: `IsString()`, `IsOptional()`.

### 3. Seguridad y Contexto de Rol
El backend determina al profesor reportante comparando el `email` del usuario autenticado en sesión con el registro correspondiente de `Profesor`. Si no coincide, o el examen no está asignado a dicho profesor, se lanza una excepción `ForbiddenException`.

---

## Referencias

- [Análisis: comunicarIncidenciasHorario](/RUP/01-analisis/casos-uso/comunicarIncidenciasHorario/README.md)
- [Esquema ER / Base de Datos](/RUP/02-diseño/esquema-er.md)
