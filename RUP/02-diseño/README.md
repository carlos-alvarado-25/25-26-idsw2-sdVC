# IdSw 2 > Disciplina de Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

Esta sección documenta la **Disciplina de Diseño** del sistema, definiendo la arquitectura técnica, la persistencia en base de datos y la realización detallada de los casos de uso para guiar la implementación.

## Stack Tecnológico Seleccionado

Se ha adoptado una arquitectura **Full-Stack TypeScript** para maximizar la coherencia del tipado entre el frontend y el backend, asegurando un ecosistema robusto y mantenible.

## Frontend: Angular
- **Framework**: Angular (Componentes, Servicios, RxJS para programación reactiva).
- **Rol**: Interfaz de usuario dinámica (SPA - Single Page Application).

## Backend: NestJS
- **Framework**: NestJS.
- **Arquitectura**: Modular (Módulos, Controladores, Servicios).
- **Rol**: Exponer la API RESTful, validación de DTOs y encapsulamiento de la lógica de negocio.

## Persistencia: MySQL + TypeORM
- **Motor**: MySQL.
- **ORM**: TypeORM (Integración nativa con NestJS).
- **Convención de Nombres**: **CamelCase** para tablas y columnas.

---

## Artefactos de Diseño Global

### 1. Arquitectura del Sistema
Visión de alto nivel de los contenedores físicos y lógicos de la aplicación.
- [Ver Diagrama de Arquitectura](arquitectura.md)

### 2. Modelo de Clases de Diseño (Persistencia y DTOs)
Traducción de las entidades de análisis a modelos concretos de TypeORM y esquemas de validación.
- [Ver Diagrama de Clases](clases-diseño.md)

### 3. Configuración del Proyecto
Definición de la estructura de directorios del código fuente y políticas de implementación.
- [Ver Documento de Configuración](configuracion-proyecto.md)

---

## Realización de Casos de Uso (Secuencias)
*(Los directorios mantienen la estructura plana para trazabilidad histórica, mapeando las clases de análisis a Controladores y Servicios de NestJS).*

### Casos de Uso Comunes
- [iniciarSesion](casos-uso/iniciarSesion/README.md) - Diseño de la interacción de acceso y validación de credenciales.
- [cerrarSesion](casos-uso/cerrarSesion/README.md) - Diseño del protocolo de desconexión y limpieza de sesión.
- [consultarCalendario](casos-uso/consultarCalendario/README.md) - Diseño del visualizador interactivo del calendario con filtros por Grado/Asignatura y políticas de visibilidad por actor.

### Gestión de Grados
- [abrirGrados](casos-uso/abrirGrados/README.md) - Diseño del hub de gestión y listado paginado.
- [crearGrado](casos-uso/crearGrado/README.md) - Diseño de la creación minimalista con transición a edición.
- [editarGrado](casos-uso/editarGrado/README.md) - Diseño de la modificación incremental y persistencia por PATCH.
- [eliminarGrado](casos-uso/eliminarGrado/README.md) - Diseño del borrado seguro con verificación de dependencias.
- [importarGrados](casos-uso/importarGrados/README.md) - Diseño del procesamiento por lotes de archivos y persistencia masiva.

### Gestión de Asignaturas
- [abrirAsignaturas](casos-uso/abrirAsignaturas/README.md) - Diseño del listado paginado con vinculación de Grado.
- [crearAsignatura](casos-uso/crearAsignatura/README.md) - Diseño de la creación rápida y transición a edición.
- [editarAsignatura](casos-uso/editarAsignatura/README.md) - Diseño de la actualización incremental y estado singular.
- [eliminarAsignatura](casos-uso/eliminarAsignatura/README.md) - Diseño del borrado seguro con diagnóstico de impacto.
- [importarAsignaturas](casos-uso/importarAsignaturas/README.md) - Diseño de la carga masiva y resolución de integridad referencial.

### Gestión de Aulas
- [abrirAulas](casos-uso/abrirAulas/README.md) - Diseño del listado de inventario de espacios físicos.
- [crearAula](casos-uso/crearAula/README.md) - Diseño de la creación rápida y transición a edición.
- [editarAula](casos-uso/editarAula/README.md) - Diseño de la actualización incremental y estado singular.
- [eliminarAula](casos-uso/eliminarAula/README.md) - Diseño del borrado seguro con diagnóstico de impacto.
- [importarAulas](casos-uso/importarAulas/README.md) - Diseño del procesamiento por lotes y validación de unicidad.

### Gestión de Alumnos
- [abrirAlumnos](casos-uso/abrirAlumnos/README.md) - Diseño del listado paginado y vinculación académica.
- [crearAlumno](casos-uso/crearAlumno/README.md) - Diseño de la creación ágil y transición a edición.
- [editarAlumno](casos-uso/editarAlumno/README.md) - Diseño de la actualización incremental y estado singular.
- [eliminarAlumno](casos-uso/eliminarAlumno/README.md) - Diseño del borrado seguro con diagnóstico de impacto.
- [importarAlumnos](casos-uso/importarAlumnos/README.md) - Diseño del procesamiento por lotes y resolución de titulaciones.

### Gestión de Profesores
- [abrirProfesores](casos-uso/abrirProfesores/README.md) - Diseño del listado paginado y personal docente.
- [crearProfesor](casos-uso/crearProfesor/README.md) - Diseño de la creación de docente con patrón El Delgado y validación de unicidad.
- [editarProfesor](casos-uso/editarProfesor/README.md) - Diseño de la actualización incremental de docente con asignación dinámica de asignaturas.
- [importarProfesores](casos-uso/importarProfesores/README.md) - Diseño del procesamiento masivo por lotes y validación de unicidad.
- [eliminarProfesor](casos-uso/eliminarProfesor/README.md) - Diseño del borrado seguro con diagnóstico previo de impacto.
- [listarConflictosExamenes](casos-uso/listarConflictosExamenes/README.md) - Diseño de la detección de conflictos de agenda del docente y gestión de preferencias horarias (PROFESOR_PREFERENCIAS_ABIERTO).

### Gestión de Exámenes y Calendario
- [abrirExamenes](casos-uso/abrirExamenes/README.md) - Diseño del listado paginado y hub del calendario de exámenes.
- [crearExamen](casos-uso/crearExamen/README.md) - Diseño de la creación de examen con patrón El Delgado y validación de unicidad de código.
- [editarExamen](casos-uso/editarExamen/README.md) - Diseño de la actualización incremental de examen con verificación de conflictos de aulas y supervisores.
- [eliminarExamen](casos-uso/eliminarExamen/README.md) - Diseño del borrado seguro de examen y confirmación interactiva.
- [asignarProfesorAExamen](casos-uso/asignarProfesorAExamen/README.md) - Diseño de la vinculación de docente supervisor a examen con verificación de conflicto horario.
- [generarCalendario](casos-uso/generarCalendario/README.md) - Diseño del motor algorítmico de asignación automática y resolución de colisiones.