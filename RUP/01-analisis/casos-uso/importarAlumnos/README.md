# IdSw 2 > importarAlumnos > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|[📂 Diseño](/RUP/02-diseño/casos-uso/importarAlumnos/README.md)|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/importarAlumnos/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-13
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
- **Repositorio**: Utiliza `AlumnoRepository`, `GradoRepository` y `UsuarioRepository`.
- **Aislamiento**: Cada fila del archivo se procesa en su propia transacción independiente, garantizando que un fallo en una fila no cancele las demás.

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

#### UsuarioRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Verificar e insertar en lote las credenciales de acceso (`Usuario`) de los estudiantes importados.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del estudiante (matrícula, nombre, email, curso), vinculados a su `Usuario`.
- Mantener la asociación con la entidad `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la dependencia académica obligatoria del alumno.

#### Usuario
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar las credenciales creadas con rol `Alumno` para permitir su login tras la importación.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Alumnos Abierto` invoca `ImportarAlumnosView.importarAlumnos()`.
2. **Contexto**: La vista solicita al controlador el formato requerido y la lista de grados disponibles.
3. **Carga**: El Administrador selecciona el archivo y solicita **Importar**.
4. **Procesamiento por fila** (aislado): `AlumnoController` lee el archivo y para cada registro:
    - Valida que los campos obligatorios estén presentes.
    - Verifica la unicidad de la matrícula mediante `AlumnoRepository`.
    - Resuelve si el grado indicado existe mediante `GradoRepository`.
    - **Resolución de email único**: Si el email del CSV ya está vinculado a otro alumno, genera automáticamente un alias numerado (ej. `nombre2@dominio.es`) para mantener la trazabilidad.
    - Abre una transacción atómica que crea el `Usuario` (con contraseña predeterminada `idsw2_2026` y rol `Alumno`) y el perfil `Alumno` vinculando su `usuarioId`.
    - Si la transacción falla, se registra el error en `detalles[]` y se continúa con la siguiente fila.
5. **Resultado**: El sistema presenta el `ImportResult` con el conteo de éxitos, fallos y notas de emails ajustados.
6. **Cierre**: El Administrador selecciona `finalizarImportacion()` para retornar al listado general.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar archivo CSV/Excel|`ImportarAlumnosView`|Interfaz de carga|
|Validar matrículas únicas|`AlumnoController`|`AlumnoRepository.findOneBy()`|
|Asignar alumnos a grados correspondientes|`AlumnoController`|`GradoRepository`|
|Generar email único si hay duplicado en CSV|`AlumnoController`|`resolveUniqueEmail(baseEmail)`|
|Crear credencial automática (`idsw2_2026`)|`UsuarioRepository`|`crearUsuario(email, password, rol)`|
|Aislar fallos por fila|`AlumnoController`|Transacción individual por fila|
|Informar resultados y errores|`ImportResult`|Muestreo en la vista|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAlumnos()](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)
