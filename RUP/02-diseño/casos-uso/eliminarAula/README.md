# IdSw 2 > eliminarAula > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarAula/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `eliminarAula()`, especificando el flujo de borrado seguro mediante la consulta previa de impacto (conteo de exámenes programados en el espacio) y la ejecución de la eliminación física en la base de datos MySQL.

## diagrama de secuencia

<div align=center>

|![Diseño: eliminarAula()](/images/02-diseño/casos-uso/eliminarAula/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/eliminarAula/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoints
1. **Diagnóstico**: `GET /aulas/:id/impacto` -> Retorna `{ examenesAsociados: number }`.
2. **Eliminación**: `DELETE /aulas/:id` -> Retorna `200 OK`.

### Frontend (Angular)

#### AulaApiService
- `verificarImpacto(id: number): Observable<{ examenesAsociados: number }>`
- `eliminar(id: number): Observable<void>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EliminarAulaView` | `ConfirmDialog` | Presentación de advertencias y captura de confirmación del Administrador. |
| `AulaController` | `AulaController` | Gestión de endpoints REST para diagnóstico y borrado. |
| `AulaController` | `AulaService` | Orquestación de la consulta de impacto y persistencia destructiva. |
| `ExamenRepository` | `ExamenRepository` | Conteo de exámenes vinculados al aula mediante `countByAulaId()`. |
| `AulaRepository` | `AulaRepository` | Eliminación física del registro en la tabla `aula` de MySQL. |
