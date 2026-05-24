# IdSw 2 > eliminarGrado > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-24
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `eliminarGrado()` mediante el patrón MVC, identificando las clases de análisis y responsabilidades necesarias para la eliminación segura de grados académicos, incluyendo la validación de dependencias con asignaturas.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarGrado()](/images/01-analisis/casos-uso/eliminarGrado/eliminarGrado-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/eliminarGrado/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarGradoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el diálogo de confirmación de eliminación al Administrador.
- Mostrar los datos del grado que se pretende eliminar.
- Visualizar advertencias si existen asignaturas asociadas al grado.
- Capturar la decisión final del usuario (Confirmar/Cancelar).
- Notificar el resultado de la operación.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarGrado(grado)` desde `:Grados Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Retorna a `:Grados Abierto`.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de eliminación.
- Verificar la existencia de dependencias (asignaturas) antes de proceder.
- Delegar la eliminación física al repositorio de grados.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EliminarGradoView`.
- **Repositorio**: Utiliza `GradoRepository` para la eliminación y `AsignaturaRepository` para verificación de dependencias.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Gestionar la eliminación del registro del grado en la persistencia.

#### AsignaturaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer información sobre la cantidad de asignaturas vinculadas a un grado específico.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el grado académico a eliminar.

## flujo de colaboración

### secuencia de operaciones

1. **Selección**: `:Grados Abierto` invoca `EliminarGradoView.eliminarGrado(grado)`.
2. **Verificación de Impacto**: `EliminarGradoView` solicita al `GradoController` verificar si hay asignaturas asociadas.
3. **Consulta de Dependencias**: `GradoController` solicita a `AsignaturaRepository` el conteo de asignaturas para ese grado.
4. **Confirmación**: La vista presenta los datos y la advertencia (si aplica). El Administrador confirma la eliminación.
5. **Ejecución**: `EliminarGradoView` → `GradoController.eliminar(grado)`.
6. **Persistencia**: `GradoController` → `GradoRepository.eliminar(grado)`.
7. **Finalización**: El sistema informa el éxito y refresca la lista en `:Grados Abierto`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar confirmación de eliminación|`EliminarGradoView`|Interfaz de usuario|
|Muestra advertencia sobre asignaturas|`GradoController` / `AsignaturaRepository`|`contarPorGrado(grado)`|
|Eliminar grado de la base de datos|`GradoRepository`|`eliminar(grado)`|
|Actualizar lista de grados|`EliminarGradoView`|Retorno a `:Grados Abierto`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirGrados()](/RUP/01-analisis/casos-uso/abrirGrados/README.md)
