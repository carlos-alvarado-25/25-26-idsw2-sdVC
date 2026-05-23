# IdSw 2 > importarGrados > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-21
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `importarGrados()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de carga masiva de datos académicos.

## diagrama de colaboración

<div align=center>

|![Análisis: importarGrados()](/images/01-analisis/casos-uso/importarGrados/importarGrados-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/importarGrados/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarGradosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de importación al Administrador.
- Mostrar el formato de archivo requerido (CSV/Excel).
- Capturar el archivo seleccionado por el usuario.
- Presentar los resultados de la importación (éxitos, errores y advertencias).
- Manejar las solicitudes de finalización o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `importarGrados()` desde `:Grados Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Retorna control a `:Grados Abierto`.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Proporcionar la especificación del formato de archivo esperado.
- Coordinar el procesamiento del archivo recibido.
- Validar la integridad y consistencia de los datos en lote.
- Transformar los datos del archivo en objetos de dominio (`Grado`).
- Gestionar los resultados de la operación masiva para la vista.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarGradosView`.
- **Repositorio**: Delega la persistencia masiva a `GradoRepository`.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el acceso a la persistencia de los grados.
- Implementar la lógica de guardado en lote (`guardarLote`).
- Verificar unicidad de registros para evitar duplicados durante la importación.

**Colaboraciones**:
- **Control**: Responde a `GradoController`.
- **Entidad**: Gestiona instancias de `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un grado académico (nombre, código, facultad).
- Mantener la integridad de sus propios atributos.

**Colaboraciones**:
- **Repositorio**: Es gestionado por `GradoRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Grados Abierto` → `ImportarGradosView.importarGrados()`
2. **Carga de guía**: `ImportarGradosView` → `GradoController.obtenerFormatoRequerido()`
3. **Selección y envío**: El Administrador carga el archivo en `ImportarGradosView`.
4. **Procesamiento masivo**: `ImportarGradosView` → `GradoController.importar(archivo)`
5. **Persistencia en lote**: `GradoController` → `GradoRepository.guardarLote(grados)`
6. **Resultados**: El sistema vuelve al estado de selección o muestra el resumen en `ImportarGradosView`.
7. **Finalización/Cancelación**: `ImportarGradosView` → `:Grados Abierto`.

### patrón de colaboración establecido

Este análisis sigue el **patrón de importación masiva**:
- **Entrada desde vista de gestión**: Se activa desde el listado/gestión de la entidad.
- **Validación en Controlador**: El controlador asume la carga pesada de validación de archivos.
- **Persistencia Atómica/Lote**: El repositorio maneja la eficiencia del guardado masivo.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Permitir seleccionar archivo CSV/Excel|`ImportarGradosView`|Interacción directa con usuario|
|Muestra formato requerido|`ImportarGradosView`|Invoca `GradoController.obtenerFormatoRequerido()`|
|Procesa y visualiza archivo|`GradoController`|`importar(archivo)`|
|Muestra número de grados importados|`ImportarGradosView`|Recibe `ImportResult` del controlador|
|Permite revisar errores|`ImportarGradosView`|Muestra detalles del `ImportResult`|

## características del análisis

### separación de responsabilidades MVC

- **Vista**: Agnostica sobre cómo se lee el Excel, solo maneja el archivo como stream/blob.
- **Control**: Contiene la lógica de parsing y validación de reglas de negocio académicas.
- **Entidad**: Define la estructura de datos pura sin conocimiento del origen (archivo).

## patrones aplicados

### repository pattern
`GradoRepository` encapsula la complejidad de insertar múltiples registros eficientemente.

### mvc pattern
Desacoplamiento total entre la UI de importación y el almacenamiento de datos.

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Diagrama de contexto - Administrador](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
