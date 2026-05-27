# IdSw 2 > editarAula > Análisis

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

Análisis de colaboración del caso de uso `editarAula()` mediante el patrón MVC. Este artefacto define la estructura necesaria para modificar la información de los espacios físicos, aplicando el estándar de persistencia incremental que mantiene al usuario en el estado de edición singular.

## diagrama de colaboración

<div align=center>

|![Análisis: editarAula()](/images/01-analisis/casos-uso/editarAula/editarAula-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/editarAula/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarAulaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Cargar y presentar los datos actuales del aula al Administrador.
- Capturar las modificaciones en el formulario (Nombre, Capacidad, Edificio, Planta, Tipo).
- Gestionar la persistencia incremental permitiendo permanecer en el estado de edición.
- Facilitar el retorno al listado general mediante las acciones de finalizar o cancelar.

**Colaboraciones**:
- **Entrada**: Recibe `editarAula(aula)` desde `:Aulas Abierto`.
- **Control**: Se comunica con `AulaController`.
- **Salida**: 
    - Transición `<<editar>>` hacia `:Aula Abierta` (permanencia).
    - Transición `<<finalizar>>` o `<<cancelar>>` hacia `:Aulas Abierto` (retorno al listado).

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de actualización de la entidad `Aula`.
- Validar la integridad de los datos introducidos.
- Aplicar los cambios a la instancia de la entidad y delegar su persistencia.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `EditarAulaView`.
- **Repositorio**: Utiliza `AulaRepository`.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Persistir los cambios del objeto `Aula` en el almacenamiento permanente (`actualizar`).

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular los datos del espacio físico y permitir su actualización controlada.

## flujo de colaboración

### secuencia de operaciones

1. **Carga**: `:Aulas Abierto` solicita `editarAula(aula)` y la vista muestra los datos actuales.
2. **Edición Incremental**: El Administrador cambia valores y selecciona **Guardar**.
3. **Persistencia**: `AulaController` actualiza la entidad `Aula` (`<<update>>`) y sincroniza con `AulaRepository.actualizar(aula)`.
4. **Estado Estable (Singular)**: Se confirma el éxito y se transita al estado `:Aula Abierta`, permitiendo continuar con la edición.
5. **Retorno al Listado (Plural)**: 
    - Al seleccionar **Finalizar**, se invoca `abrirAulas()` y se retorna a `:Aulas Abierto`.
    - Al seleccionar **Cancelar**, se retorna a `:Aulas Abierto` descartando cambios no guardados.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar datos de edición|`EditarAulaView`|Carga inicial de datos|
|Modificar nombre, capacidad, edificio, planta, tipo|`EditarAulaView`|Inputs del formulario|
|Guardar cambios en base de datos|`AulaRepository`|`actualizar(aula)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAulas()](/RUP/01-analisis/casos-uso/abrirAulas/README.md)
