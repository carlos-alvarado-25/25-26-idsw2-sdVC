# IdSw 2 > asignarProfesorAExamen > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/asignarProfesorAExamen/README.md)|[📐 Diseño](/RUP/02-diseño/casos-uso/asignarProfesorAExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Construcción (Construction)
- **Disciplina**: Implementación
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Gemini CLI

## propósito

Implementación del flujo de vinculación de docentes supervisores a exámenes programados. El sistema permite al Administrador seleccionar un docente y asignarle exámenes que carezcan de supervisor, garantizando mediante validación reactiva y persistente que no existan colisiones horarias para el profesor seleccionado.

## componentes implementados

### Backend (NestJS)

#### 1. ExamenService (`src/backend/src/modules/examenes/examenes.service.ts`)
- **`findSinProfesor(q, page)`**: Implementa un `QueryBuilder` que filtra exclusivamente exámenes con `profesorId IS NULL`. Soporta búsqueda por código de examen o nombre/código de asignatura.
- **`verificarConflictoProfesor(id, profesorId)`**: Lógica central de validación que calcula solapamientos horarios basados en `fecha`, `hora` y `duracion`.
- **`detectarSolapamiento()`**: Método privado refactorizado para centralizar la lógica de colisión horaria (DRY).

#### 2. ExamenController (`src/backend/src/modules/examenes/examenes.controller.ts`)
- **`GET /examenes/sin-profesor`**: Endpoint para el buscador del frontend.
- **`GET /examenes/:id/conflicto-profesor`**: Endpoint de validación proactiva.
- **`PATCH /examenes/:id`**: Reutilización del contrato de actualización para la vinculación final.

### Frontend (Angular)

#### 1. AsignarProfesorExamenComponent (`src/frontend/src/app/features/admin/profesores/asignar-profesor-examen/`)
- **Gestión de Contexto**: El componente se inicializa con el `profesorId` de la ruta, bloqueando el docente como contexto de la operación.
- **Buscador Reactivo**: Implementa búsqueda con paginación para los exámenes disponibles.
- **Validación UI**: Badge de estado (Disponible/Conflicto) que se actualiza automáticamente al seleccionar un examen, deshabilitando la confirmación si existe solapamiento.

## estándares y principios aplicados

1.  **Principio de Delegación (Backend)**: Las entidades `Asignatura` y `Examen` proveen métodos de acceso a los nombres de sus asociaciones (ej. `nombreAsignatura`, `nombreGrado`), eliminando el code smell de "Train Wreck" (Ley de Demeter) en los servicios.
2.  **Defensa en Profundidad**: La validación de conflicto horario se realiza en el Frontend para mejorar la UX y se re-ejecuta en el Backend durante el `save()` para garantizar la integridad de los datos.
3.  **Indirección por Volumen**: El buscador de exámenes utiliza `PagedResult` para asegurar que el sistema sea eficiente incluso con miles de exámenes sin asignar.

## evidencias de implementación

<div align=center>

| Artefacto | Ruta |
|---|---|
| Componente TS | `src/frontend/src/app/features/admin/profesores/asignar-profesor-examen/asignar-profesor-examen.component.ts` |
| Vista HTML | `src/frontend/src/app/features/admin/profesores/asignar-profesor-examen/asignar-profesor-examen.component.html` |
| Estilos CSS | `src/frontend/src/app/features/admin/profesores/asignar-profesor-examen/asignar-profesor-examen.component.css` |
| Servicio API | `src/frontend/src/app/core/services/examen.service.ts` |

</div>

## referencias

- [Análisis: asignarProfesorAExamen](/RUP/01-analisis/casos-uso/asignarProfesorAExamen/README.md)
- [Diseño: asignarProfesorAExamen](/RUP/02-diseño/casos-uso/asignarProfesorAExamen/README.md)
