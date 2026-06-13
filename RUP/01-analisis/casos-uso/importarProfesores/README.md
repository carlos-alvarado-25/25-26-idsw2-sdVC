# IdSw 2 > importarProfesores > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|[📂 Diseño](/RUP/02-diseño/casos-uso/importarProfesores/README.md)|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/importarProfesores/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `importarProfesores()` mediante el patrón MVC, identificando las clases de análisis, responsabilidades y colaboraciones necesarias para la carga masiva de docentes y la validación de integridad (emails únicos y departamentos válidos).

## diagrama de colaboración

<div align=center>

|![Análisis: importarProfesores()](/images/01-analisis/casos-uso/importarProfesores/importarProfesores-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/importarProfesores/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarProfesoresView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de importación masiva al Administrador.
- Mostrar la especificación del formato requerido (CSV/Excel).
- Visualizar el listado de departamentos disponibles para guiar la carga.
- Capturar el archivo seleccionado por el usuario.
- Presentar los resultados del procesamiento (`ImportResult`).
- Manejar las solicitudes de finalización o cancelación del proceso.

**Colaboraciones**:
- **Entrada**: Recibe `importarProfesores()` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Retorna control a `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Proporcionar la guía de formato y la lista de departamentos válidos.
- Coordinar el procesamiento del archivo recibido.
- Validar la integridad de los datos en lote (campos obligatorios y formato).
- **Validación de Unicidad**: Asegurar que los emails en el archivo no estén duplicados ni existan previamente en el sistema.
- Transformar filas del archivo en objetos `Profesor`.
- Gestionar los resultados de la operación masiva para la vista.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarProfesoresView`.
- **Repositorio**: Delega la persistencia a `ProfesorRepository` y `UsuarioRepository`.
- **Aislamiento**: Cada fila del archivo se procesa en su propia transacción independiente, garantizando que un fallo en una fila no cancele las demás.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el acceso a la persistencia de los profesores.
- Implementar la lógica de guardado en lote (`guardarLote`).
- Proveer métodos para verificar la existencia de emails en la base de datos.

#### UsuarioRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Verificar e insertar en lote las credenciales de acceso (`Usuario`) de los profesores importados.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un docente (nombre, código, email, departamento) vinculado a su `Usuario`.
- Mantener la integridad de sus propios atributos.

#### Usuario
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar las credenciales creadas con rol `Profesor` para permitir su login tras la importación.

## flujo de colaboración

### secuencia de operaciones

1. **Apertura**: `:Profesores Abierto` invoca `ImportarProfesoresView.importarProfesores()`.
2. **Configuración**: La vista solicita el formato y departamentos al `ProfesorController`.
3. **Carga**: El Administrador selecciona y envía el archivo.
4. **Procesamiento por fila** (aislado): `ProfesorController` procesa el archivo y para cada registro:
    - Valida que los campos obligatorios estén presentes.
    - Verifica la unicidad de código y email mediante `ProfesorRepository`.
    - Abre una transacción atómica que crea el `Usuario` (con contraseña predeterminada `idsw2_2026` y rol `Profesor`) y el perfil `Profesor` vinculando su `usuarioId`.
    - Si la transacción falla, se registra el error en `detalles[]` y se continúa con la siguiente fila.
5. **Resultados**: La vista muestra el resumen de la importación (número de éxitos, errores por fila).
6. **Cierre**: El flujo retorna a `:Profesores Abierto`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar archivo CSV/Excel|`ImportarProfesoresView`|Interfaz de usuario|
|Muestra departamentos disponibles|`ProfesorController`|`obtenerDepartamentosDisponibles()`|
|Valida código y emails únicos por fila|`ProfesorController`|`ProfesorRepository.findOneBy()`|
|Crear credencial automática (`idsw2_2026`)|`UsuarioRepository`|`crearUsuario(email, password, rol)`|
|Aislar fallos por fila|`ProfesorController`|Transacción individual por fila|
|Muestra número de profesores importados|`ImportarProfesoresView`|Visualización de `ImportResult`|
|Muestra errores y correcciones|`ImportarProfesoresView`|Detalle de `ImportResult`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirProfesores()](/RUP/01-analisis/casos-uso/abrirProfesores/README.md)
