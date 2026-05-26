# Análisis de Casos de Uso

Esta carpeta contiene el análisis MVC (Model-View-Controller) de cada caso de uso prioritario especificado, incluyendo diagramas de colaboración.

## Casos de uso analizados

### Gestión de Grados (Administrador)
- [abrirGrados](abrirGrados/README.md) - Hub de gestión y listado de grados académicos.
- [crearGrado](crearGrado/README.md) - Análisis de creación manual de grados.
- [editarGrado](editarGrado/README.md) - Análisis de modificación de grados existentes.
- [eliminarGrado](eliminarGrado/README.md) - Análisis de eliminación segura de grados.
- [importarGrados](importarGrados/README.md) - Análisis de carga masiva de grados académicos.

### Gestión de Asignaturas (Administrador)
- [abrirAsignaturas](abrirAsignaturas/README.md) - Hub de gestión y listado paginado de asignaturas.
- [crearAsignatura](crearAsignatura/README.md) - Análisis de creación manual de asignaturas vinculadas a Grados.
- [editarAsignatura](editarAsignatura/README.md) - Análisis de modificación de asignaturas existentes y reasignación de grados.
- [eliminarAsignatura](eliminarAsignatura/README.md) - Análisis de eliminación segura de materias con control de impacto.
- [importarAsignaturas](importarAsignaturas/README.md) - Análisis de carga masiva de asignaturas con resolución de dependencias.

### Gestión de Profesores (Administrador)
- [abrirProfesores](abrirProfesores/README.md) - Hub de gestión y listado paginado de profesores.
- [crearProfesor](crearProfesor/README.md) - Análisis de creación manual de perfiles docentes.
- [editarProfesor](editarProfesor/README.md) - Análisis de modificación de perfiles y gestión de carga lectiva.
- [importarProfesores](importarProfesores/README.md) - Análisis de carga masiva de profesores con validación de emails.

### Gestión de Exámenes (Administrador)
- [abrirExamenes](abrirExamenes/README.md) - Hub de gestión y listado de exámenes.
- [crearExamen](crearExamen/README.md) - Análisis de creación manual de exámenes.
- [editarExamen](editarExamen/README.md) - Análisis de modificación de exámenes y asignación de recursos.
- [eliminarExamen](eliminarExamen/README.md) - Análisis de eliminación de exámenes programados.


## Estructura de análisis

Cada carpeta de análisis contiene:

- **README.md** - Análisis MVC completo del caso de uso.
- **colaboracion.puml** - Diagrama de colaboración entre clases de análisis.
- **secuencia.puml** - Diagrama de secuencia (para casos complejos).

## Clases de análisis aplicadas

### Boundary (Vista)
- Clases de interfaz que manejan la interacción con el actor.
- Responsables de presentar datos y capturar solicitudes.

### Control (Controlador)
- Clases que coordinan la lógica del caso de uso.
- Orquestan las colaboraciones entre boundary y entity.

### Entity (Entidad)
- Clases que representan conceptos del dominio.
- Repositories y entidades de negocio.

## Metodología de análisis

- **Patrón MVC** aplicado sistemáticamente.
- **Colaboraciones explícitas** entre clases de análisis.
- **Trazabilidad** desde especificación hasta análisis.
- **Agnosticismo tecnológico** en la definición de responsabilidades.
