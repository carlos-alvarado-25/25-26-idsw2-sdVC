# IdSw 2 — Sistema de Generación de Calendarios de Exámenes

> | [🏠 Inicio](/README.md) | [📊 Requisitos](/RUP/00-requisitos/README.md) | [🔍 Análisis](/RUP/01-analisis/casos-uso/README.md) | [📂 Diseño](/RUP/02-diseño/README.md) | [⚙️ Desarrollo](/RUP/03-desarrollo/README.md) | [📝 Bitácora](/conversation-log.md) |
> |---|---|---|---|---|---|

Este proyecto consiste en una **plataforma web académica integrada** para la automatización, gestión y consulta de calendarios de exámenes, desarrollada bajo la metodología **RUP (Rational Unified Process)** y siguiendo las pautas de arquitectura limpia de **pySigHor**.

El sistema resuelve la distribución temporal y espacial de evaluaciones utilizando un motor greedy con soft constraints y validaciones automáticas de conflictos en tiempo real.

---

## 🚀 Características Principales

### 1. Gestión Administrativa (CRUD & Carga Masiva)
*   Administración completa de **Grados, Asignaturas, Profesores, Alumnos y Aulas** en vistas paginadas de alta escala.
*   Importación de datos masivos desde archivos estructurados (CSV/Excel) con validación sintáctica y de clave foránea.

### 2. Motor de Programación Inteligente (`CalendarioEngine`)
*   **Restricciones Duras (Hard Constraints)**: Impide programar exámenes que generen solapamientos físicos en aulas o colisiones de supervisión de profesores en la misma franja.
*   **Heurística de Dispersión Académica**: Algoritmo de penalización de ranuras horarias para asegurar que los estudiantes del mismo año y carrera no rindan múltiples exámenes en días consecutivos (dispersión realista).
*   **Prevención de Conflictos Manuales**: El módulo bloquea reubicaciones manuales de exámenes que violen las preferencias horarias o generen colisiones de alumnos/supervisores.

### 3. Portal del Profesor (Incidencias y Preferencias)
*   **Gestión de Preferencias**: Calendario interactivo semanal donde el docente registra sus franjas de indisponibilidad para no ser asignado a supervisiones.
*   **Buzón Unificado de Incidencias**: Panel responsivo de doble columna donde el profesor reporta conflictos sobre exámenes asignados y visualiza el estado de sus quejas en tiempo real.

### 4. Portal del Alumno (Consulta Contextual)
*   **Filtro Seguro de Información**: Los alumnos inician sesión y acceden a una vista adaptada que restringe los calendarios y asignaturas únicamente a los pertenecientes a su titulación (evitando fugas de datos).
*   **Exportación Multiformato**: Descarga de calendarios de exámenes en formato PDF y Excel (implementado bajo el patrón *Strategy* y DTOs inmutables para garantizar el desacoplamiento).

---

## 🛠️ Stack Tecnológico

*   **Backend**: NestJS 11, TypeORM, MySQL 8, JWT, Bcrypt.
*   **Frontend**: Angular 21, RxJS, HTML5 semántico y CSS Vanilla responsivo.

---

## 🔑 Credenciales de Prueba (Contraseña común: `idsw2_2026`)

*   **Administrador**: `admin@idsw2.edu`
*   **Profesor**: `manuel.masias@uneatlantico.es`
*   **Alumno**: `pedro.sanchez@alumnos.uneatlantico.es`

---

## 📦 Instalación y Ejecución

### Requisitos Previos
*   Node.js (versión 20 o superior).
*   MySQL Server (con una base de datos vacía llamada `generador_calendarios`).

### Paso 1: Configurar el Backend
1.  Navega a `/src/backend`.
2.  Instala las dependencias: `npm install`.
3.  Crea un archivo `.env` configurando los accesos a tu MySQL:
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_DATABASE=generador_calendarios
    JWT_SECRET=secret_key_idsw2_2026_dev_only
    ```
4.  Puebla el esquema inicial importando los archivos SQL en orden:
    1.  `sql/initial_schema.sql` (crea tablas y usuario administrador).
    2.  `sql/add_profesor.sql` (crea entidades profesor).
    3.  `sql/create_incidencia.sql`
    4.  `sql/create_preferencia.sql`
5.  Inicia el servidor de desarrollo: `npm run start:dev` (corriendo en `http://localhost:3000`).

### Paso 2: Configurar el Frontend
1.  Navega a `/src/frontend`.
2.  Instala las dependencias: `npm install`.
3.  Inicia el servidor local: `npm start` (corriendo en `http://localhost:4200`).

---

## 🗺️ Mapa de Trazabilidad RUP

*   **Disciplina de Requisitos**:
    *   [Diagramas de Contexto e Hilos por Actor](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
    *   [Especificaciones Detalladas de Casos de Uso](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
*   **Disciplina de Análisis**:
    *   [Diagramas de Colaboración MVC](/RUP/01-analisis/casos-uso/README.md)
*   **Disciplina de Diseño**:
    *   [Diagrama de Arquitectura y Clases](/RUP/02-diseño/README.md)
    *   [Diagramas de Secuencia Detallados por Caso de Uso](/RUP/02-diseño/casos-uso)
*   **Disciplina de Implementación**:
    *   [Mapeado de Desarrollo](/RUP/03-desarrollo/README.md)
*   **Registro Histórico**:
    *   [Bitácora de Sesiones de VibeCoding](/conversation-log.md)
