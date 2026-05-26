# IdSw 2 > eliminarProfesor > Análisis

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

Análisis de colaboración del caso de uso `eliminarProfesor()` mediante el patrón MVC. El objetivo es identificar las clases de análisis y responsabilidades necesarias para la eliminación de perfiles docentes, asegurando la advertencia explícita sobre exámenes asignados y la limpieza coordinada de preferencias.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarProfesor()](/images/01-analisis/casos-uso/eliminarProfesor/eliminarProfesor-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/eliminarProfesor/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el diálogo de confirmación de eliminación al Administrador.
- Mostrar los detalles del profesor (Código, Nombre, Departamento).
- Visualizar la advertencia cuantitativa sobre los **exámenes asignados** al docente.
- Capturar la decisión final del usuario.
- Notificar el resultado de la operación.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarProfesor(profesor)` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Retorna a `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de verificación de impacto y eliminación.
- Consultar al `ExamenRepository` para cuantificar los exámenes vinculados.
- Gestionar la persistencia de la eliminación del perfil y sus preferencias.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EliminarProfesorView`.
- **Repositorio**: Utiliza `ProfesorRepository`, `ExamenRepository` y `PreferenciaRepository`.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Eliminar el registro del perfil docente de la persistencia.

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer el conteo de exámenes donde el profesor es el responsable (`contarPorProfesor`).

#### PreferenciaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Eliminar las restricciones y preferencias horarias asociadas al docente.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al docente en el proceso de eliminación.

## flujo de colaboración

### secuencia de operaciones

1. **Selección**: `:Profesores Abierto` invoca `EliminarProfesorView.eliminarProfesor(profesor)`.
2. **Verificación**: La vista solicita `verificarExamenesAsignados(profesor)`.
3. **Consulta de Impacto**: El controlador pregunta a `ExamenRepository` el número de exámenes vinculados al docente.
4. **Confirmación**: La vista presenta los datos y la advertencia (ej. "Este profesor tiene 4 exámenes asignados"). El Administrador confirma la acción.
5. **Ejecución**: `EliminarProfesorView` → `ProfesorController.eliminar(profesor)`.
6. **Limpieza y Persistencia**: El controlador orquestas la eliminación en `PreferenciaRepository` y `ProfesorRepository`.
7. **Finalización**: Se notifica el éxito y se refresca el listado general en `:Profesores Abierto`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar confirmación de eliminación|`EliminarProfesorView`|Interfaz de usuario|
|Advertir sobre exámenes asignados|`ExamenRepository`|`contarPorProfesor(profesor)`|
|Eliminar profesor de la base de datos|`ProfesorRepository`|`eliminar(profesor)`|
|Eliminar preferencias asociadas|`PreferenciaRepository`|`eliminarPorProfesor(profesor)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirProfesores()](/RUP/01-analisis/casos-uso/abrirProfesores/README.md)
