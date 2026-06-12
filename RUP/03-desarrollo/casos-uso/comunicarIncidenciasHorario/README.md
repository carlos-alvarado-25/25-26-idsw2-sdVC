# IdSw 2 > comunicarIncidenciasHorario > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/comunicarIncidenciasHorario/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/comunicarIncidenciasHorario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación/Desarrollo
- **Versión**: 1.0
- **Fecha**: 2026-06-12
- **Autor**: Gemini CLI

## Propósito

Documentación de los componentes de código implementados en el Backend (NestJS) y Frontend (Angular) para realizar el caso de uso `comunicarIncidenciasHorario()`, resolviendo el ciclo completo de reporte del profesor y revisión del administrador.

---

## Componentes Desarrollados (Backend - NestJS)

### 1. Modelo de Persistencia (TypeORM)
*   **Archivo**: [incidencia.entity.ts](/src/backend/src/entities/incidencia.entity.ts)
*   **Definición**: Define la entidad `@Entity('Incidencia')` con campos `tipo`, `descripcion`, `evidencias`, `estado` (enum PENDIENTE/RESUELTA/RECHAZADA), y relaciones `@ManyToOne(() => Examen)` y `@ManyToOne(() => Profesor)`.

### 2. DTOs de Validación
*   **CrearIncidenciaDto** ([crear-incidencia.dto.ts](/src/backend/src/modules/incidencias/dto/crear-incidencia.dto.ts)): Valida la obligatoriedad del examen, tipo de incidencia (restringido a los 4 tipos predefinidos) y longitud mínima de la descripción.
*   **UpdateIncidenciaEstadoDto** ([update-incidencia-estado.dto.ts](/src/backend/src/modules/incidencias/dto/update-incidencia-estado.dto.ts)): Restringe la actualización de estados a los valores enum admitidos.

### 3. Servicio de Negocio
*   **Archivo**: [incidencias.service.ts](/src/backend/src/modules/incidencias/incidencias.service.ts)
*   **Responsabilidades**:
    *   `crear(...)`: Busca y vincula el profesor mediante email, recupera el examen, valida que esté asignado al docente reportante (seguridad de datos) y persiste la incidencia.
    *   `listarPorProfesor(...)` y `listarTodas(...)`: Devuelven incidencias filtradas u organizadas cargando relaciones.
    *   `actualizarEstado(...)`: Permite cambiar el estado de la incidencia (para administradores).

### 4. Controlador y Módulo
*   **Controlador**: [incidencias.controller.ts](/src/backend/src/modules/incidencias/incidencias.controller.ts)
*   **Módulo**: [incidencias.module.ts](/src/backend/src/modules/incidencias/incidencias.module.ts)
*   **Endpoints**:
    *   `POST /incidencias`: Alta de incidencias por query email.
    *   `GET /incidencias`: Listado contextualizado (completo para admin, filtrado para profesores).
    *   `PATCH /incidencias/:id/estado`: Actualización de estado por parte de admin.

---

## Componentes Desarrollados (Frontend - Angular)

### 1. Servicio de API
*   **Archivo**: [incidencia.service.ts](/src/frontend/src/app/core/services/incidencia.service.ts)
*   **Métodos**: `crear(...)`, `listar(...)`, `actualizarEstado(...)`.

### 2. Formulario de Reporte (Profesor)
*   **Componente**: [comunicar-incidencia.component.ts](/src/frontend/src/app/features/profesor/incidencias/comunicar-incidencia/comunicar-incidencia.component.ts)
*   **Apertura**:
    *   *Modo Fijo*: Abre con `:examenId` preseleccionado desde el botón de la consulta del calendario.
    *   *Modo Selección*: Si no hay ID, carga un listado de los exámenes asignados al profesor para su libre elección.
*   **Navegación**: Utiliza `completarComunicacion()` al guardar con éxito (redirigiendo a `/calendario/consultar`) o el botón cancelar.

### 3. Bandeja de Gestión (Administrador)
*   **Componente**: [listar-incidencias.component.ts](/src/frontend/src/app/features/admin/incidencias/listar-incidencias/listar-incidencias.component.ts)
*   **Responsabilidades**: Muestra todas las incidencias y permite a los administradores marcarlas como **RESUELTA** o **RECHAZADA** en tiempo real.

---

## Referencias

- [Diseño detallado: comunicarIncidenciasHorario](/RUP/02-diseño/casos-uso/comunicarIncidenciasHorario/README.md)
- [UML de Secuencia](/modelosUML/02-diseño/casos-uso/comunicarIncidenciasHorario/secuencia.puml)
