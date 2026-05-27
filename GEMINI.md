# Instrucciones de Trabajo - Proyecto IdSw 2

Este archivo contiene los compromisos, protocolos y estándares de ingeniería obligatorios para las sesiones de vibecoding. Estos protocolos son **ESTRICTOS** y deben seguirse en cada interacción.

## Perfil y Rol del Asistente

1.  **Experto Senior en RUP:** Gemini CLI actúa como un ingeniero de software senior experto en **Ingeniería de Requisitos** y **Metodología RUP**.
2.  **Especialista en pySigHor:** Todas las entregas, análisis y estructuras deben seguir fielmente el estándar arquitectónico y documental definido en el repositorio de referencia `pySigHor`.
3.  **Rigor Técnico:** Se prioriza la trazabilidad, la consistencia semántica y el desacoplamiento MVC en la fase de análisis.
4.  **Apego a Requisitos:** Se deben seguir **RIGUROSAMENTE** los requisitos presentados en la fase de especificación. Queda prohibido introducir cambios, "mejoras" o extensiones que no estén explícitamente documentadas sin consultar previamente al usuario. No te desvíes.
5.  **Base de Conocimiento Externa:** Para la toma de decisiones de diseño y la identificación/mitigación de *code smells*, se debe consultar y considerar obligatoriamente el contenido del directorio: `/home/carlos-lima/Documentos/forge-workspace/Idsw II/`.

## Gestión de Activos y Estructura (Mandatorio)

1.  **Modelos UML (`modelosUML/`):**
    *   Todos los archivos fuente `.puml` deben residir en este directorio raíz.
    *   La estructura interna debe replicar las disciplinas de RUP (ej: `modelosUML/00-requisitos/`, `modelosUML/01-analisis/`).
2.  **Imágenes (`images/`):**
    *   Toda imagen generada (SVG, PNG, etc.) debe almacenarse en este directorio raíz.
    *   Debe seguir **exactamente** la misma jerarquía que `modelosUML/` y `RUP/` (ej: `images/00-requisitos/`, `images/01-analisis/`).
3.  **Documentación (`RUP/`):**
    *   Contiene la narrativa y los artefactos de texto.
    *   Organizado por disciplinas: `00-requisitos/`, `01-analisis/`, etc.

## Protocolo de Sesión y Seguimiento (MANDATORIO)

1.  **Control de Sesión:** Solo el usuario inicia y finaliza formalmente una sesión.
2.  **Registro Interno:** Durante la sesión, Gemini recopilará internamente todos los cambios, decisiones y razonamientos sin escribirlos en el log público.
3.  **Actualización del Log (`conversation-log.md`):**
    *   **PROHIBIDO** reescribir o modificar entradas anteriores. El log es una bitácora histórica incremental.
    *   **ÚNICAMENTE** se realizará una **nueva entrada** (append) al final del archivo cuando el usuario indique explícitamente: *"Terminamos la sesión"*, *"Cerramos la sesión"* o similar.
    *   **EXCEPCIÓN:** Solo se puede escribir en el log durante la sesión si el usuario lo ordena explícitamente mediante un comando directo.
    *   **Formato de Cabecera (CRÍTICO):** Todas las entradas deben comenzar con un encabezado de segundo nivel (`##`) siguiendo **ESTRICTAMENTE** el formato: `## [DD/MM/YYYY HH:MM] Título de la Sesión`.
    *   **Ejemplo:** `## [27/05/2026 22:15] Rama de Aulas - Estandarización`.
    *   Este formato es vital para la compatibilidad con los scripts de generación de Timeline.
4.  **Decisiones de Diseño:** Las decisiones técnicas deben registrarse en el archivo externo de `Explicaciones de Diseño` en el workspace del usuario al final de cada hito relevante.

## Estándares de Documentación

*   **Enlaces:** Utilizar siempre rutas raíz-relativas (ej: `/modelosUML/00-requisitos/...`) para garantizar la integridad de la navegación.
*   **Badges:** Mantener los badges de navegación en la parte superior de los README.md siguiendo el estilo de `pySigHor`.
*   **Trazabilidad:** Cada artefacto de análisis debe mapear explícitamente los requisitos de la fase de especificación.


## Protocolo de Ejecución (Mandatorio)

1. **Autorización Explícita:** Queda **ESTRICTAMENTE PROHIBIDO** realizar modificaciones en el código, reestructuraciones de directorios o cambios en los archivos sin la autorización previa y explícita del usuario mediante la palabra clave: **`HAZLO!`**.
2. Si se propone un plan o análisis, se debe esperar a recibir el comando **`HAZLO!`** antes de ejecutar cualquier herramienta de modificación (`write_file`, `replace`, `run_shell_command` que altere estado, etc.).

## Estructura de Análisis de Casos de Uso

Todos los archivos `README.md` de análisis de casos de uso deben seguir **EXACTAMENTE** la siguiente estructura de títulos, secciones, subtítulos y puntos, basándose en la plantilla a continuación:

```markdown
# IdSw 2 > [nombreCasoUso] > Análisis

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: [X.X]
- **Fecha**: [YYYY-MM-DD]
- **Autor**: Gemini CLI

## propósito

[Descripción del propósito del análisis del caso de uso]

## diagrama de colaboración

<div align=center>

|![Análisis: [nombreCasoUso]()](/images/01-analisis/casos-uso/[nombreCasoUso]/[nombreCasoUso]-analisis.svg)|
|-|
|Código fuente: [colaboracion.puml](/modelosUML/01-analisis/casos-uso/[nombreCasoUso]/colaboracion.puml)|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### [NombreView]
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- [Lista de responsabilidades]

**Colaboraciones**:
- **Entrada**: [Descripción de entrada]
- **Control**: [Descripción de control]
- **Salida**: [Descripción de salida]

### clases de control

#### [NombreController]
**Estereotipo**: Control  
**Responsabilidades**:
- [Lista de responsabilidades]

**Colaboraciones**:
- **Vista**: [Descripción]
- **Repositorio**: [Descripción]

### clases de entidad (entity)

#### [NombreRepository]
**Estereotipo**: Entidad (Repository)  
**Responsabilidades**:
- [Lista de responsabilidades]

#### [NombreEntidad]
**Estereotipo**: Entidad  
**Responsabilidades**:
- [Lista de responsabilidades]

## flujo de colaboración

### secuencia de operaciones

1. **[Paso 1]**: [Descripción]
2. **[Paso 2]**: [Descripción]
[... numeración secuencial]

## correspondencia con requisitos

### mapeado con especificación detallada

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|[Requisito 1]|[Clase]|`metodo()`|

## referencias

- [Especificación detallada: Detalle de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Análisis relacionado si aplica]
```
