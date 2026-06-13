# IdSw 2 > Modelo de Clases de Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/README.md)|[🏗️ Arquitectura](arquitectura.md)|**Clases de Diseño**|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito
Este artefacto define el modelo de datos detallado y la estructura de clases del dominio para la implementación con **TypeORM** y **MySQL**. Sirve como el plano maestro para la creación de las tablas de la base de datos y las entidades del backend en **NestJS**.

## Diagrama de Clases de Diseño Global

<div align=center>

|![Diagrama de Clases de Diseño](/images/02-diseño/clases-diseño.svg)|
|-|
|Código fuente: [clases-diseño.puml](/modelosUML/02-diseño/clases-diseño.puml)|

</div>

## Decisiones de Diseño Arquitectónico (Backend)

1.  **Arquitectura en Capas (N-Tier) Exhaustiva**: Se adopta el estándar de NestJS dividiendo la lógica de todas las ramas funcionales en:
    - **API Layer (Controllers)**: Gestión de peticiones HTTP, validación de DTOs y mapeado de rutas para Grados, Asignaturas, Profesores, Aulas, Alumnos, Exámenes e Incidencias.
    - **Business Logic Layer (Services)**: Orquestación de reglas de negocio, destacando el `CalendarioService` para el motor de generación.
    - **Data Access Layer (Repositories)**: Abstracción de la persistencia mediante Repositorios especializados de TypeORM para cada entidad del dominio.
    - **Domain Layer (Entities)**: Modelado exhaustivo de datos y relaciones en MySQL.
2.  **Independencia de la Identidad (Desacoplamiento)**: La entidad `Usuario` se mantiene como un componente de seguridad independiente. Para evitar acoplar el dominio académico con la seguridad, se inyecta un servicio unificado `UsersService` en `AlumnoService` y `ProfesorService`, abstrayendo la lógica de hashing y sincronización transaccional de credenciales.
3.  **Inyección de Dependencias Total**: El diseño refleja la jerarquía de colaboración desde los controladores hasta las entidades, asegurando una arquitectura modular y testeable.
4.  **Objetos de Transferencia y Resultado**: Uso sistemático de DTOs para la entrada y Value Objects (`GeneracionResult`, `ImportResult`) para estructurar las respuestas complejas del servidor.
5.  **Arquitectura de Importación (Estrategia)**: Se abstrae el procesamiento de archivos mediante la interfaz `IFileParser` y la factoría `FileParserFactory`. Esto permite que los servicios de negocio reciban datos en formato JSON independientemente de si el origen es CSV o Excel. El sistema garantiza la integridad de los datos mediante el saneamiento automático de espacios en blanco (`trim`) y el soporte nativo para codificación **UTF-8** (codepage 65001), asegurando el tratamiento correcto de caracteres especiales del español.
6.  **Refactorización por Cohesión y DRY (Bajo Acoplamiento)**: Con el fin de maximizar la cohesión de los servicios de negocio y eliminar código duplicado, se ha extraído la validación matemática de solapamientos horarios y de aulas en un componente validador específico `ExamenConflictValidator`. Asimismo, la conversión y comparación de intervalos temporales se ha centralizado en una utilidad común `TimeUtils`, promoviendo un diseño limpio y reutilizable en todo el backend.

## Relaciones Principales

- **Grado - Asignatura**: Composición fuerte (un grado contiene múltiples asignaturas).
- **Asignatura - Profesor**: Relación Muchos a Muchos (un profesor imparte varias materias y viceversa).
- **Examen**: Entidad operativa central que vincula Asignatura, Aula y Profesor.
- **Preferencia**: Dependencia fuerte del Profesor para la gestión de su disponibilidad horaria.
