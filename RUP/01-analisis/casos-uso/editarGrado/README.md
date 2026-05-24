# IdSw 2 > editarGrado > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-22
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `editarGrado()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para modificar la información de grados académicos existentes.

## diagrama de colaboración

<div align=center>

|![Análisis: editarGrado()](/images/01-analisis/casos-uso/editarGrado/editarGrado-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/editarGrado/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarGradoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Cargar y presentar los datos actuales del grado al Administrador.
- Capturar las modificaciones realizadas en el formulario (Código, Nombre, Descripción).
- Gestionar las acciones de "Guardar" y "Cancelar".
- Notificar el resultado de la actualización al usuario.

**Colaboraciones**:
- **Entrada**: Recibe `editarGrado(grado)` desde `:Grados Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Retorna a `:Grados Abierto` tras finalizar o cancelar.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de actualización de la entidad.
- Validar que el nuevo código (si se cambia) no colisione con otro grado existente.
- Aplicar los cambios a la instancia de la entidad `Grado`.
- Delegar la persistencia de los cambios al repositorio.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EditarGradoView`.
- **Repositorio**: Utiliza `GradoRepository` para validación y persistencia.
- **Entidad**: Actualiza el estado interno de `Grado`.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Proveer métodos para verificar unicidad de códigos excluyendo el ID actual.
- Persistir los cambios del objeto `Grado` en el almacenamiento permanente (`actualizar`).

**Colaboraciones**:
- **Control**: Responde a solicitudes de `GradoController`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del grado.
- Permitir la modificación controlada de sus atributos.

**Colaboraciones**:
- **Control**: Es manipulado por `GradoController`.

## flujo de colaboración

### secuencia de operaciones

1. **Carga**: `:Grados Abierto` solicita `editarGrado(grado)` y la vista muestra los datos actuales.
2. **Modificación**: El Administrador cambia valores y solicita guardar.
3. **Petición de Actualización**: `EditarGradoView` → `GradoController.actualizar(grado, codigo, nombre, descripcion)`.
4. **Validación de Unicidad**: `GradoController` → `GradoRepository.existeCodigo(nuevoCodigo)` (para prevenir duplicidad de códigos).
5. **Cambio de Estado**: `GradoController` actualiza la entidad `Grado`.
6. **Persistencia**: `GradoController` → `GradoRepository.actualizar(grado)`.
7. **Retorno**: La vista informa el éxito y redirige a `:Grados Abierto`.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar datos de edición|`EditarGradoView`|Carga inicial de datos|
|Permitir introducir nuevo código/nombre/descripción|`EditarGradoView`|Inputs del formulario|
|Guardar cambios en base de datos|`GradoRepository`|`actualizar(grado)`|
|Descartar cambios al cancelar|`EditarGradoView`|Retorno sin invocar persistencia|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirGrados()](/RUP/01-analisis/casos-uso/abrirGrados/README.md)
