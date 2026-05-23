# IdSw 2 > crearGrado > Análisis

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

Análisis de colaboración del caso de uso `crearGrado()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para la creación manual de nuevos grados académicos en el sistema.

## diagrama de colaboración

<div align=center>

|![Análisis: crearGrado()](/images/01-analisis/casos-uso/crearGrado/crearGrado-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/crearGrado/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearGradoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación (Código, Nombre, Descripción) al Administrador.
- Capturar los datos introducidos por el usuario.
- Validar visualmente la presencia de campos obligatorios antes del envío.
- Manejar las solicitudes de guardado y cancelación.
- Notificar al Administrador sobre el éxito o errores en la creación.

**Colaboraciones**:
- **Entrada**: Recibe `crearGrado()` desde `:Grados Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Navega hacia `:Grado Abierto` (Edición) tras éxito o `:Grados Abierto` tras cancelación.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar el flujo de creación de un grado.
- Verificar la unicidad del código del grado a través del repositorio.
- Instanciar la entidad `Grado` con los datos validados.
- Coordinar la persistencia del nuevo objeto.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `CrearGradoView`.
- **Repositorio**: Utiliza `GradoRepository` para validación y persistencia.
- **Entidad**: Crea instancias de `Grado`.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el almacenamiento de los grados.
- Proveer métodos para verificar existencia por código (`existeCodigo`).
- Persistir nuevas instancias de `Grado` (`guardar`).

**Colaboraciones**:
- **Control**: Responde a solicitudes de `GradoController`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar los datos de un grado académico.
- Asegurar la integridad de su estado interno.

**Colaboraciones**:
- **Control**: Es instanciado por `GradoController`.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Grados Abierto` → `CrearGradoView.crearGrado()`
2. **Entrada de Datos**: El Administrador completa el formulario y solicita guardar.
3. **Validación de Negocio**: `CrearGradoView` → `GradoController.crear(datos)`
4. **Comprobación de Unicidad**: `GradoController` → `GradoRepository.existeCodigo(codigo)`
5. **Instanciación**: `GradoController` instancía un nuevo objeto `Grado`.
6. **Persistencia**: `GradoController` → `GradoRepository.guardar(grado)`
7. **Navegación Pos-creación**: `CrearGradoView` transfiere el control a `editarGrado()` para permitir el refinamiento del nuevo registro.

### patrón de colaboración establecido

Este análisis sigue el **patrón "El Delgado" (Crear y Editar)**:
- **Creación Minimalista**: Se capturan solo los datos esenciales.
- **Transición Inmediata**: Tras la persistencia exitosa, se navega automáticamente al modo de edición para mantener el flujo de trabajo del usuario.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Introducir código, nombre y descripción|`CrearGradoView`|Formulario de entrada|
|Validación de campos requeridos|`CrearGradoView` / `GradoController`|Lógica de validación previa al guardado|
|Guardar nuevo grado en base de datos|`GradoRepository`|`guardar(grado)`|
|Verificar duplicados|`GradoController`|Invoca `GradoRepository.existeCodigo()`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis: abrirGrados()](/RUP/01-analisis/casos-uso/abrirGrados/README.md)
