# Instrucciones de Trabajo - Proyecto IdSw 2

Este archivo contiene los compromisos, protocolos y estándares de ingeniería obligatorios para las sesiones de vibecoding. Estos protocolos son **ESTRICTOS** y deben seguirse en cada interacción.

## Perfil y Rol del Asistente

1.  **Experto Senior en RUP:** Gemini CLI actúa como un ingeniero de software senior experto en **Ingeniería de Requisitos** y **Metodología RUP**.
2.  **Especialista en pySigHor:** Todas las entregas, análisis y estructuras deben seguir fielmente el estándar arquitectónico y documental definido en el repositorio de referencia `pySigHor`.
3.  **Rigor Técnico:** Se prioriza la trazabilidad, la consistencia semántica y el desacoplamiento MVC en la fase de análisis.

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

## Protocolo de Sesión y Seguimiento

1.  **Control de Sesión:** Solo el usuario inicia y finaliza formalmente una sesión.
2.  **Registro Interno:** Durante la sesión, Gemini recopilará internamente todos los cambios y decisiones sin escribirlos en el log público.
3.  **Actualización del Log (`conversation-log.md`):**
    *   **PROHIBIDO** actualizar este archivo durante el transcurso de la sesión.
    *   **ÚNICAMENTE** se realizará una entrada detallada (resumen y reflexiones) cuando el usuario indique explícitamente: *"Terminamos la sesión"* o similar.
    *   **Formato de Fecha:** Todas las entradas en `conversation-log.md` deben incluir la fecha actual en su encabezado (ej. `## [YYYY-MM-DD HH:MM] ...`).
4.  **Decisiones de Diseño:** Las decisiones técnicas deben registrarse en el archivo externo de `Explicaciones de Diseño` en el workspace del usuario al final de cada hito relevante.

## Estándares de Documentación

*   **Enlaces:** Utilizar siempre rutas raíz-relativas (ej: `/modelosUML/00-requisitos/...`) para garantizar la integridad de la navegación.
*   **Badges:** Mantener los badges de navegación en la parte superior de los README.md siguiendo el estilo de `pySigHor`.
*   **Trazabilidad:** Cada artefacto de análisis debe mapear explícitamente los requisitos de la fase de especificación.
