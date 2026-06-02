# IdSw 2 > Análisis de Casos de Uso

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

Esta sección documenta la **Disciplina de Análisis** del sistema, traduciendo los requisitos funcionales en colaboraciones de objetos siguiendo el patrón **MVC (Model-View-Controller)**.

---

## Organización por Contexto

Para garantizar la claridad administrativa, los casos de uso se organizan lógicamente aunque mantengan una estructura de directorios plana.

### 0. Casos de Uso Comunes (Transversales)
*Funcionalidades compartidas por Administradores, Profesores y Alumnos.*

- **Acceso**: [iniciarSesion](iniciarSesion/README.md) | [cerrarSesion](cerrarSesion/README.md)
- **Visualización**: [consultarCalendario](consultarCalendario/README.md)
- **Utilidades**: [descargarCalendarioExamenes](descargarCalendarioExamenes/README.md) | [completarConsulta](completarConsulta/README.md)
- **Diagnóstico**: [listarConflictosExamenes](listarConflictosExamenes/README.md)

### 1. Contexto del Administrador
*Operaciones exclusivas de gestión académica y motor de generación.*

- **Grados**: [abrir](abrirGrados/README.md) | [crear](crearGrado/README.md) | [editar](editarGrado/README.md) | [eliminar](eliminarGrado/README.md) | [importar](importarGrados/README.md)
- **Asignaturas**: [abrir](abrirAsignaturas/README.md) | [crear](crearAsignatura/README.md) | [editar](editarAsignatura/README.md) | [eliminar](eliminarAsignatura/README.md) | [importar](importarAsignaturas/README.md)
- **Profesores**: [abrir](abrirProfesores/README.md) | [crear](crearProfesor/README.md) | [editar](editarProfesor/README.md) | [eliminar](eliminarProfesor/README.md) | [importar](importarProfesores/README.md)
- **Aulas**: [abrir](abrirAulas/README.md) | [crear](crearAula/README.md) | [editar](editarAula/README.md) | [eliminar](eliminarAula/README.md) | [importar](importarAulas/README.md)
- **Alumnos**: [abrir](abrirAlumnos/README.md) | [crear](crearAlumno/README.md) | [editar](editarAlumno/README.md) | [eliminar](eliminarAlumno/README.md) | [importar](importarAlumnos/README.md)
- **Calendario**: [generarCalendario](generarCalendario/README.md) | [abrirExamenes](abrirExamenes/README.md) | [crearExamen](crearExamen/README.md) | [editarExamen](editarExamen/README.md) | [eliminarExamen](eliminarExamen/README.md) | [asignarProfesor](asignarProfesorAExamen/README.md)
- **Transiciones**: [completarGestion](completarGestion/README.md) | [completarProceso](completarProceso/README.md)

### 2. Contexto del Profesor (En Progreso)
*Operaciones específicas del personal docente.*

- *Pendiente*: [comunicarIncidenciasHorario](comunicarIncidenciasHorario/README.md)

---

## Estándares de Análisis Aplicados

1.  **Patrón MVC Estricto**: Separación clara entre `Boundary` (Vista), `Control` (Controlador) y `Entity` (Entidades/Repositories).
2.  **Principio de Delegación**: Aplicación de la **Ley de Demeter** en las entidades para evitar acoplamiento innecesario.
3.  **Navegación por Estados**: Diferenciación entre estados **Plurales** (listados) y **Singulares** (detalle/edición) con persistencia incremental.
4.  **Escalabilidad (Alto Volumen)**: Uso sistemático de `PagedResult` para entidades con gran volumen de datos (Exámenes, Alumnos, Profesores).
5.  **Single Source of Truth**: Componentes transversales analizados una sola vez para asegurar consistencia sistémica.
