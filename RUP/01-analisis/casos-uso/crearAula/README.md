# IdSw 2 > crearAula > Análisis

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

Análisis de colaboración del caso de uso `crearAula()` mediante el patrón MVC. Este artefacto define el flujo para el alta manual de espacios físicos, siguiendo la estrategia "El Delgado" que permite una creación rápida y transición inmediata a la edición completa.

## diagrama de colaboración

<div align=center>

|![Análisis: crearAula()](/images/01-analisis/casos-uso/crearAula/crearAula-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/crearAula/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearAulaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de captura minimalista (Código, Nombre, Capacidad, Edificio, Planta, Tipo).
- Capturar los datos introducidos por el Administrador.
- Manejar las acciones de guardado y cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `crearAula()` desde `:Aulas Abierto`.
- **Control**: Envía datos a `AulaController`.
- **Salida**: Navega hacia `:Aula Abierta` (vía `editarAula()`) tras el éxito o retorna a `:Aulas Abierto` tras cancelar.

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar la creación del nuevo recurso físico.
- Validar la unicidad del código del aula antes de la persistencia.
- Instanciar la entidad `Aula` y delegar su guardado.

**Colaboraciones**:
- **Vista**: Atiende solicitudes de `CrearAulaView`.
- **Repositorio**: Utiliza `AulaRepository`.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Verificar la existencia de códigos de aula (`existeCodigo`).
- Persistir nuevas instancias de la entidad (`guardar`).

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular el estado inicial del espacio físico recién creado.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: El Administrador selecciona crear una nueva aula desde el listado.
2. **Carga**: `:Aulas Abierto` invoca `CrearAulaView.crearAula()`.
3. **Entrada de Datos**: Se completan los campos básicos y se solicita guardar.
4. **Validación**: `AulaController` verifica mediante `AulaRepository` que el código no esté duplicado.
5. **Creación y Persistencia**: Se instancia la entidad `Aula` y se sincroniza con el repositorio (`guardar`).
6. **Transición**: Tras el éxito, se confirma el guardado y se transita automáticamente al estado de edición singular `:Aula Abierta` (invocando `editarAula()`).

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir código, nombre, capacidad, edificio, planta, tipo|`CrearAulaView`|Formulario de entrada|
|Verificar que el código sea único|`AulaController`|`AulaRepository.existeCodigo(codigo)`|
|Guardar nueva aula en base de datos|`AulaRepository`|`guardar(aula)`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md)
- [Análisis: abrirAulas()](/RUP/01-analisis/casos-uso/abrirAulas/README.md)
