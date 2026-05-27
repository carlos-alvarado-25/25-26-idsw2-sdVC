# IdSw 2 > eliminarAula > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-27
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `eliminarAula()` mediante el patrón MVC. Este artefacto define el flujo para la eliminación segura de espacios físicos, incorporando la verificación de integridad referencial con la entidad `Examen` para advertir sobre posibles conflictos en el calendario académico.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarAula()](/images/01-analisis/casos-uso/eliminarAula/eliminarAula-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/eliminarAula/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarAulaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar los datos del aula a eliminar y solicitar confirmación.
- Mostrar la advertencia cuantitativa sobre los exámenes afectados.
- Gestionar las acciones de confirmar o cancelar la eliminación.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarAula(aula)` desde `:Aulas Abierto`.
- **Control**: Se comunica con `AulaController`.
- **Salida**: Retorna a `:Aulas Abierto`.

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar la verificación de impacto destructivo.
- Coordinar con el repositorio de exámenes para cuantificar dependencias.
- Delegar la eliminación física al repositorio de aulas.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EliminarAulaView`.
- **Repositorio**: Utiliza `AulaRepository` y `ExamenRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer el conteo de exámenes vinculados a un aula específica (`verificarExamenesAsociados`).

#### AulaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Ejecutar la eliminación del objeto `Aula` en el almacenamiento permanente.

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del espacio físico a eliminar.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El Administrador solicita eliminar un aula desde el listado.
2. **Carga**: `:Aulas Abierto` invoca `EliminarAulaView.eliminarAula(aula)`.
3. **Verificación de Impacto**: La vista solicita al controlador `verificarExamenesAsociados(aula)`.
4. **Consulta de Dependencias**: `AulaController` solicita a `ExamenRepository.contarPorAula(aula)`.
5. **Presentación**: La vista muestra el número de exámenes programados en dicha aula y solicita confirmación.
6. **Confirmación**: El Administrador selecciona **Confirmar**.
7. **Persistencia Destructiva**: `AulaController` solicita `AulaRepository.eliminar(aula)`.
8. **Finalización**: Se notifica el éxito y se retorna al listado general (`abrirAulas()`).

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar datos del aula a eliminar|`EliminarAulaView`|Renderizado inicial|
|Advertencia sobre exámenes programados|`ExamenRepository`|`contarPorAula(aula)`|
|Eliminar aula de la base de datos|`AulaRepository`|`eliminar(aula)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAulas()](/RUP/01-analisis/casos-uso/abrirAulas/README.md)
