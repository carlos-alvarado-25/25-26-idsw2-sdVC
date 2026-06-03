# IdSw 2 > eliminarAsignatura > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarAsignatura/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `eliminarAsignatura()`, especificando el flujo de borrado seguro mediante la consulta previa de impacto (conteo de exámenes vinculados) y la ejecución de la eliminación física en la base de datos MySQL.

## diagrama de secuencia

<div align=center>

|![Diseño: eliminarAsignatura()](/images/02-diseño/casos-uso/eliminarAsignatura/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/eliminarAsignatura/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoints
1. **Diagnóstico**: `GET /asignaturas/:id/impacto` -> Retorna `{ examenesAsociados: number }`.
2. **Eliminación**: `DELETE /asignaturas/:id` -> Retorna `200 OK`.

### Frontend (Angular)

#### AsignaturaApiService
- `verificarImpacto(id: number): Observable<{ examenesAsociados: number }>`
- `eliminar(id: number): Observable<void>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EliminarAsignaturaView` | `ConfirmDialog` | Presentación de advertencias y captura de confirmación. |
| `AsignaturaController` | `AsignaturaController` | Gestión de endpoints de diagnóstico y eliminación. |
| `AsignaturaController` | `AsignaturaService` | Orquestación de consultas de impacto y persistencia. |
| `ExamenRepository` | `ExamenRepository` | Conteo de exámenes vinculados mediante `count()`. |
| `AsignaturaRepository` | `AsignaturaRepository` | Eliminación física del registro en MySQL. |
