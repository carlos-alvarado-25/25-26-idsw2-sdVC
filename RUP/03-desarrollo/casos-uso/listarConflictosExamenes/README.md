# IdSw 2 > listarConflictosExamenes > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/listarConflictosExamenes/README.md)|[📐 Diseño](/RUP/02-diseño/casos-uso/listarConflictosExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación/Desarrollo
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Gemini CLI

## Propósito

Registro y guía de implementación para el caso de uso `listarConflictosExamenes()`. Contiene la trazabilidad de los archivos del Backend y Frontend creados o modificados durante la fase de desarrollo.

## Archivos Afectados / Creados

### Backend (NestJS)
- `src/backend/src/modules/examenes/dto/conflicto-alumno.dto.ts` (Nuevo)
- `src/backend/src/modules/profesores/dto/crear-preferencia.dto.ts` (Nuevo)
- `src/backend/src/modules/examenes/examenes.service.ts` (Modificado: método `findConflictosAlumnos`)
- `src/backend/src/modules/examenes/examenes.controller.ts` (Modificado: endpoint `GET /examenes/conflictos`)
- `src/backend/src/modules/profesores/profesores.service.ts` (Modificado: métodos CRUD de preferencias)
- `src/backend/src/modules/profesores/profesores.module.ts` (Modificado: registro de entidad `Preferencia` y `PreferenciaController`)
- `src/backend/src/modules/profesores/preferencia.controller.ts` (Nuevo: controlador de preferencias)

### Frontend (Angular)
- `src/frontend/src/app/core/services/preferencia.service.ts` (Nuevo)
- `src/frontend/src/app/core/services/examen.service.ts` (Modificado)
- `src/frontend/src/app/app.routes.ts` (Modificado)
- `src/frontend/src/app/features/admin/profesores/profesor-form/profesor-form.component.html` (Modificado)
- `src/frontend/src/app/features/admin/profesores/profesor-preferencias/profesor-preferencias.component.ts` (Nuevo)
- `src/frontend/src/app/features/admin/profesores/profesor-preferencias/profesor-preferencias.component.html` (Nuevo)
- `src/frontend/src/app/features/admin/profesores/profesor-preferencias/profesor-preferencias.component.css` (Nuevo)
