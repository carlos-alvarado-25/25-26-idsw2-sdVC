# IdSw 2 > consultarCalendario > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/consultarCalendario/README.md)|[📐 Diseño](/RUP/02-diseño/casos-uso/consultarCalendario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación/Desarrollo
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Gemini CLI

## Propósito

Registro y guía de implementación para el caso de uso `consultarCalendario()`. Contiene la trazabilidad de los archivos del Backend y Frontend creados o modificados durante la fase de desarrollo.

## Archivos Afectados / Creados

### Backend (NestJS)
- `src/backend/src/modules/examenes/examenes.service.ts` (Modificado: método `findCalendario`)
- `src/backend/src/modules/examenes/examenes.controller.ts` (Modificado: endpoint `GET /examenes/calendario`)
- `src/backend/src/modules/examenes/examenes.module.ts` (Modificado: inyección del repositorio de Alumno)
- `src/backend/src/modules/asignaturas/asignaturas.service.ts` (Modificado: método `findByGrado`)
- `src/backend/src/modules/asignaturas/asignaturas.controller.ts` (Modificado: endpoint `GET /asignaturas/por-grado/:gradoId`)

### Frontend (Angular)
- `src/frontend/src/app/core/services/examen.service.ts` (Modificado: método `obtenerCalendario`)
- `src/frontend/src/app/core/services/asignatura.service.ts` (Modificado: método `buscarPorGrado`)
- `src/frontend/src/app/app.routes.ts` (Modificado: registro de ruta para consulta)
- `src/frontend/src/app/features/home/home.component.ts` (Modificado: lógica de tarjetas por rol y enlace)
- `src/frontend/src/app/features/calendario/consultar-calendario/consultar-calendario.component.ts` (Nuevo: lógica del calendario interactivo)
- `src/frontend/src/app/features/calendario/consultar-calendario/consultar-calendario.component.html` (Nuevo: plantilla del calendario mensual/semanal/diario)
- `src/frontend/src/app/features/calendario/consultar-calendario/consultar-calendario.component.css` (Nuevo: estilos para la cuadrícula y tarjetas)
