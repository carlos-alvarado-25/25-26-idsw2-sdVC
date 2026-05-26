# IdSw 2 > asignarProfesorAExamen > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-05-26
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `asignarProfesorAExamen()` mediante el patrón MVC. El objetivo es identificar las clases de análisis y responsabilidades necesarias para vincular docentes a exámenes programados, asegurando la verificación de disponibilidad y la integridad del calendario académico, respetando el flujo de estados desde la edición del profesor.

## diagrama de colaboración

<div align=center>

|![Análisis: asignarProfesorAExamen()](/images/01-analisis/casos-uso/asignarProfesorAExamen/asignarProfesorAExamen-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/asignarProfesorAExamen/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AsignarProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de asignación de docentes.
- Proveer selectores paginados y filtrables para Profesores y Exámenes pendientes.
- Mostrar el estado de disponibilidad del profesor seleccionado para la franja horaria del examen.
- Capturar la confirmación de la asignación y gestionar las acciones de cancelación.
- Notificar el éxito de la operación y disparar la actualización visual del calendario.

**Colaboraciones**:
- **Entrada**: Recibe `asignarProfesor()` desde `:Profesor Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Retorna a `:Profesor Abierto` (específicamente al estado de gestión de carga docente).

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la búsqueda de profesores y exámenes sin asignar mediante los repositorios.
- **Validación de Conflictos**: Verificar si el profesor tiene otros exámenes solapados en la misma fecha y hora.
- Aplicar la asignación del profesor a la entidad `Examen`.
- Orquestar la persistencia de la actualización.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `AsignarProfesorView`.
- **Repositorio**: Utiliza `ExamenRepository` y `ProfesorRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer el listado paginado de exámenes que aún no tienen profesor asignado (`obtenerPendientesAsignacion`).
- Realizar la comprobación técnica de cruces de horario para un profesor específico (`hayCruceHorario`).
- Persistir la actualización de la entidad `Examen`.

#### ProfesorRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer búsqueda paginada y filtrable de profesores.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el evento programado.
- Permitir la vinculación de un `Profesor` responsable.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al docente que será asignado al examen.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Profesor Abierto` invoca `AsignarProfesorView.asignarProfesor()`.
2. **Carga de Candidatos**: La vista solicita al controlador los profesores disponibles y los exámenes sin docente (ambos mediante contratos paginados).
3. **Selección**: El Administrador busca y selecciona un Profesor y un Examen de las listas.
4. **Verificación**: La vista solicita `verificarDisponibilidad(profesor, examen)`. El controlador consulta al repositorio si existe un cruce horario para ese docente.
5. **Pre-asignación**: El sistema muestra la disponibilidad y permite solicitar la pre-asignación.
6. **Confirmación**: El Administrador confirma la acción; `AsignarProfesorView` llama a `asignar(examen, profesor)`.
7. **Sincronización**: El controlador actualiza la entidad `Examen` (`<<update>>`) y confirma los cambios en `ExamenRepository.actualizar(examen)`.
8. **Finalización**: Se notifica al profesor (lógica delegada) y se retorna al estado `:Profesor Abierto` para continuar con la edición del perfil docente.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Permitir seleccionar profesor disponible|`ProfesorRepository`|`buscarPaginados(criterio, pagina)`|
|Muestra exámenes sin profesor asignado|`ExamenRepository`|`obtenerPendientesAsignacion(pagina)`|
|Verifica disponibilidad|`ExamenRepository`|`hayCruceHorario(profesor, examen)`|
|Asigna profesor al examen|`Examen`|`<<update>>` de asociación|
|Actualiza calendario y notifica|`ExamenRepository`|`actualizar(examen)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirExamenes()](/RUP/01-analisis/casos-uso/abrirExamenes/README.md)
- [Análisis: editarProfesor()](/RUP/01-analisis/casos-uso/editarProfesor/README.md)
