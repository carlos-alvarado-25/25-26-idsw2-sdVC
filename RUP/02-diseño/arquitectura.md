# IdSw 2 > Arquitectura del Sistema

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Arquitectura**|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito
Este artefacto describe la arquitectura técnica del sistema, identificando los componentes de software, su distribución física en nodos y los protocolos de comunicación utilizados. Se ha optado por una arquitectura de **Tres Capas** con una clara separación entre la interfaz de usuario, la lógica de negocio y el almacenamiento persistente.

## Diagrama de Arquitectura (Nodos y Contenedores)

<div align=center>

|![Diagrama de Arquitectura](/images/02-diseño/arquitectura-sistema.svg)|
|-|
|Código fuente: [arquitectura.puml](/modelosUML/02-diseño/arquitectura.puml)|

</div>

## Descripción de Componentes

### 1. Cliente (Frontend SPA)
- **Tecnología**: Angular.
- **Responsabilidad**: Interfaz de usuario rica y reactiva. Gestiona el estado de la aplicación en el navegador y se comunica con el servidor mediante peticiones asíncronas.
- **Comunicación**: Utiliza el protocolo **HTTP/HTTPS** enviando y recibiendo datos en formato **JSON**.

### 2. Servidor de Aplicaciones (Backend API)
- **Tecnología**: NestJS.
- **Capas Internas**:
    - **Controllers**: Exponen los Endpoints de la API REST y gestionan la validación de entrada (DTOs).
    - **Services**: Encapsulan la lógica de negocio pura y la orquestación de recursos.
    - **TypeORM / Entities**: Gestionan el mapeo objeto-relacional y el acceso eficiente a la base de datos.
- **Seguridad**: Implementa guardianes (Guards) para la validación de sesiones.

### 3. Servidor de Base de Datos (Persistencia)
- **Tecnología**: MySQL.
- **Responsabilidad**: Almacenamiento persistente, íntegro y relacional de todos los activos del sistema (Grados, Profesores, Exámenes, etc.).

## Decisiones Arquitectónicas

1.  **Desacoplamiento Total**: El frontend y el backend son proyectos independientes que podrían desplegarse en servidores distintos, comunicándose exclusivamente vía API.
2.  **Seguridad por Capas**: La validación de datos ocurre tanto en el Frontend (UX) como en el Backend (Integridad), asegurando que ninguna petición malformada llegue a la base de datos.
3.  **Escalabilidad**: El uso de NestJS permite una organización modular que facilita el crecimiento del sistema sin aumentar la complejidad del mantenimiento.
