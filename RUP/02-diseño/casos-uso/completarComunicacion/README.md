# IdSw 2 > completarComunicacion > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/completarComunicacion/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/completarComunicacion/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-12
- **Autor**: Gemini CLI

## Propósito

Realización técnica detallada de la transición de navegación `completarComunicacion()`. Este documento describe cómo el sistema devuelve al Profesor a un estado estable (`:Sistema Disponible`) al finalizar de forma exitosa o cancelar el reporte de incidencias.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: completarComunicacion()](/images/02-diseño/casos-uso/completarComunicacion/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/completarComunicacion/secuencia.puml)|

</div>

## Detalles Técnicos

### 1. Flujo de Navegación (Frontend - Angular)
La transición es de navegación pura en la interfaz reactiva:
*   **Acción de Aceptación/Envío**: Al guardarse la incidencia en el backend, el componente muestra un mensaje de éxito mediante un banner temporal de estado y redirige al listado usando el `Router` de Angular hacia `/calendario/consultar`.
*   **Acción de Cancelación**: El botón "Cancelar" gatilla la misma navegación `this.router.navigate(['/calendario/consultar'])` descartando cualquier cambio en el formulario reactivo.

---

## Referencias

- [Análisis: completarComunicacion](/RUP/01-analisis/casos-uso/completarComunicacion/README.md)
- [Navegación General y Rutas](/RUP/02-diseño/configuracion-proyecto.md)
