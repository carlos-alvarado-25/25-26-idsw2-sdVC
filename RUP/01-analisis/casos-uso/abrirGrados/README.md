# IdSw 2 > abrirGrados > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitado/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitado/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-05-22
- **Autor**: Gemini CLI

## propósito

Análisis de colaboración del caso de uso `abrirGrados()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para gestionar el listado y acceso a las operaciones de los grados académicos.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirGrados()](/images/RUP/01-analisis/casos-uso/abrirGrados/abrirGrados-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarGradosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de apertura de grados desde el sistema.
- Interactuar con el controlador para obtener la lista inicial de grados.
- Presentar la lista (Código, Nombre, Descripción) al Administrador.
- Capturar criterios de filtrado y enviarlos al controlador.
- Proveer puntos de acceso para crear, editar, eliminar e importar grados.
- Manejar el retorno al estado de gestión general del sistema.

**Colaboraciones**:
- **Entrada**: Recibe `abrirGrados()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Navega hacia `:Sistema Disponible` o colaboraciones de CRUD/Importación.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la recuperación de la lista completa de grados.
- Gestionar la lógica de filtrado por criterios de búsqueda.
- Servir de puente entre la interfaz de usuario y la persistencia de datos.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ListarGradosView`.
- **Repositorio**: Delega la obtención de datos a `GradoRepository`.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- Abstraer el acceso a los datos almacenados de los grados.
- Proporcionar métodos para obtener todos los registros (`obtenerTodos`).
- Implementar búsquedas optimizadas por criterios específicos (`buscarPorCriterio`).

**Colaboraciones**:
- **Control**: Responde a `GradoController`.
- **Entidad**: Gestiona instancias de `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Encapsular la información de un grado (ID, nombre, descripción).
- Mantener la integridad de sus propios datos.

**Colaboraciones**:
- **Repositorio**: Es gestionado por `GradoRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `ListarGradosView.abrirGrados()`
2. **Listado inicial**: `ListarGradosView` → `GradoController.listarGrados()`
3. **Acceso a datos**: `GradoController` → `GradoRepository.obtenerTodos()`
4. **Filtrado (opcional)**: El Administrador introduce un criterio; `ListarGradosView` → `GradoController.filtrarGrados(criterio)`
5. **Búsqueda**: `GradoController` → `GradoRepository.buscarPorCriterio(criterio)`
6. **Navegación**: La vista permite saltar a otras colaboraciones (`crear`, `editar`, `eliminar`, `importar`) o finalizar con `completarGestion()`.

### patrón de colaboración establecido

Este análisis sigue el **patrón de listado y gestión**:
- **Centralización**: Actúa como el centro de mando (hub) para la entidad `Grado`.
- **Reutilización de Controladores**: El `GradoController` ya identificado en las importaciones extiende sus responsabilidades al listado.
- **Trazabilidad**: Conecta directamente el menú principal con las operaciones específicas de la entidad.

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de grados|`ListarGradosView`|Coordina con `GradoController.listarGrados()`|
|Código, nombre, descripción|`Grado`|Atributos encapsulados en la entidad|
|Permitir filtrar lista|`ListarGradosView`|Invoca `GradoController.filtrarGrados(criterio)`|
|Acciones CRUD / Importación|`ListarGradosView`|Puntos de navegación a otras colaboraciones|

## patrones aplicados

### repository pattern
`GradoRepository` separa la lógica de consulta de la lógica de aplicación.

### mvc pattern
Asegura que la presentación de la lista sea independiente de cómo se recuperan o filtran los grados.

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitado/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Diagrama de contexto - Administrador](/RUP/00-requisitado/01-casos-de-uso/2-DiagramaDeContexto/README.md)
