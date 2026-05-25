# IdSw 2 > crearAsignatura > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-05-25
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `crearAsignatura()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y las dependencias necesarias con la entidad `Grado` para la creación manual de nuevas materias académicas.

## diagrama de colaboración

<div align=center>

|![Análisis: crearAsignatura()](/images/01-analisis/casos-uso/crearAsignatura/crearAsignatura-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/crearAsignatura/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearAsignaturaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de asignatura (Código, Nombre, Créditos).
- Proveer una interfaz de selección de Grado (lista conceptual).
- Capturar la entrada del Administrador y gestionar las acciones de guardado y cancelación.
- Notificar el éxito de la creación y redirigir a la edición completa de la materia.

**Colaboraciones**:
- **Entrada**: Recibe `crearAsignatura()` desde `:Asignaturas Abierta`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Navega hacia `:Asignatura Abierta` (Edición) o `:Asignaturas Abierta`.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Proporcionar la lista conceptual de Grados para el formulario.
- Validar la integridad de los datos recibidos de la vista.
- Verificar la unicidad del código de la asignatura.
- Orquestar la instanciación de `Asignatura` y su persistencia.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `CrearAsignaturaView`.
- **Repositorio**: Utiliza `AsignaturaRepository` y `GradoRepository`.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Gestionar la persistencia de las asignaturas.
- Verificar la existencia de asignaturas por código.

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer la lista conceptual de Grados académicos (`obtenerTodos`).

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar los datos de una materia y su vinculación con un `Grado`.
- **Delegación**: Implementar métodos para exponer datos del grado (ej. `getNombreGrado()`) siguiendo la Ley de Demeter.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el grado académico al que se vinculará la nueva asignatura.

## flujo de colaboración

### secuencia de operaciones

1. **Carga de Formulario**: `:Asignaturas Abierta` invoca `CrearAsignaturaView.crearAsignatura()`.
2. **Selección de Dependencia**: La vista solicita `obtenerGradosDisponibles()` al controlador.
3. **Consulta de Datos**: El controlador recupera la lista conceptual de grados desde `GradoRepository.obtenerTodos()`.
4. **Captura**: El Administrador selecciona el grado de la lista, introduce los datos de la asignatura (código, nombre, créditos) y solicita guardar.
5. **Validación y Creación**: `AsignaturaController` verifica unicidad y crea la instancia de `Asignatura`.
6. **Persistencia**: Se delega el guardado a `AsignaturaRepository.guardar(asignatura)`.
7. **Transición**: Se redirige automáticamente a `editarAsignatura()` para permitir refinamientos posteriores.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir código, nombre y créditos|`CrearAsignaturaView`|Captura de formulario|
|Seleccionar grado asociado|`GradoRepository`|`obtenerTodos()`|
|Validar campos requeridos|`AsignaturaController`|Lógica de creación|
|Persistir en base de datos|`AsignaturaRepository`|`guardar(asignatura)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirAsignaturas()](/RUP/01-analisis/casos-uso/abrirAsignaturas/README.md)
