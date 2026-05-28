# IdSw 2 > importarAlumnos > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-28
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `importarAlumnos()` mediante el patrón MVC. Este artefacto define la estructura necesaria para realizar la carga masiva de estudiantes desde archivos externos, asegurando la resolución de dependencias académicas (Grados) y la validación de integridad referencial.

## diagrama de colaboración

<div align=center>

|![Análisis: importarAlumnos()](/images/01-analisis/casos-uso/importarAlumnos/importarAlumnos-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/importarAlumnos/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarAlumnosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de carga y mostrar el formato de archivo requerido.
- Mostrar la lista conceptual de grados disponibles para facilitar la preparación del archivo.
- Capturar el archivo seleccionado y gestionar el inicio de la importación.
- Presentar el resumen del proceso (`ImportResult`) y gestionar la finalización o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `importarAlumnos()` desde `:Alumnos Abierto`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: Retorna a `:Alumnos Abierto`.

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Proveer la especificación del formato y el catálogo de grados de apoyo.
- Orquestar el procesamiento del archivo y la validación de matrículas únicas.
- Validar la existencia de los grados referenciados en el archivo.
- Delegar la persistencia masiva al repositorio mediante `guardarLote`.
- Generar el objeto `ImportResult` con el balance de la operación.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `ImportarAlumnosView`.
- **Repositorio**: Utiliza `AlumnoRepository` y `GradoRepository`.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Verificar la existencia de matrículas en el sistema.
- Ejecutar la persistencia en lote de las entidades `Alumno` validadas.

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer el catálogo de grados para la validación de dependencias durante la importación.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del estudiante (matrícula, nombre, email, curso).
- Mantener la asociación con la entidad `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la dependencia académica obligatoria del alumno.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Alumnos Abierto` invoca `ImportarAlumnosView.importarAlumnos()`.
2. **Contexto**: La vista solicita al controlador el formato requerido y la lista de grados disponibles.
3. **Carga**: El Administrador selecciona el archivo y solicita **Importar**.
4. **Procesamiento**: `AlumnoController` lee el archivo y para cada registro:
    - Valida la unicidad de la matrícula mediante `AlumnoRepository`.
    - Valida que el grado indicado exista mediante `GradoRepository`.
5. **Sincronización**: El controlador delega la persistencia a `AlumnoRepository.guardarLote(alumnos)`.
6. **Resultado**: El sistema presenta el `ImportResult` informando de éxitos y errores (matrículas duplicadas o grados no encontrados).
7. **Cierre**: El Administrador selecciona `finalizarImportacion()` para retornar al listado general.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar archivo CSV/Excel|`ImportarAlumnosView`|Interfaz de carga|
|Validar matrículas únicas|`AlumnoController`|`AlumnoRepository`|
|Asignar alumnos a grados correspondientes|`AlumnoController`|`GradoRepository`|
|Informar resultados y errores|`ImportResult`|Muestreo en la vista|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAlumnos()](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)
