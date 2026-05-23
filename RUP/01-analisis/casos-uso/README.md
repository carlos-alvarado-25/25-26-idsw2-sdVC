# Análisis de Casos de Uso

Esta carpeta contiene el análisis MVC (Model-View-Controller) de cada caso de uso prioritario especificado, incluyendo diagramas de colaboración.

## Casos de uso analizados

### Gestión de Grados (Administrador)
- [abrirGrados](abrirGrados/README.md) - Hub de gestión y listado de grados académicos.
- [importarGrados](importarGrados/README.md) - Análisis de carga masiva de grados académicos.

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
