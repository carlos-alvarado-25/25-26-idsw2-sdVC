# IdSw 2 > Configuración y Scaffolding del Proyecto

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Configuración**|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 2.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito

Este documento define la estructura de directorios, configuraciones iniciales y decisiones técnicas necesarias para materializar la arquitectura NestJS + Angular en código ejecutable. Sirve como el plano de ingeniería definitivo para iniciar la fase de Construcción.

## Filosofía de Organización

### Principios aplicados

1. **Modularidad NestJS**: Organización por módulos funcionales para encapsular responsabilidades.
2. **Full-Stack TypeScript**: Compartición conceptual de tipos y interfaces entre frontend y backend.
3. **Persistencia Relacional**: Uso de TypeORM para gestionar la integridad en MySQL mediante CamelCase.
4. **Trazabilidad Absoluta**: Cada componente de código debe mapear a una clase o colaboración de diseño.

## Estructura del Proyecto (Scaffolding)

### Backend (NestJS)

```text
src/backend/
├── common/                 # Componentes transversales
│   ├── interfaces/         # Contratos globales (ej. IFileParser)
│   ├── services/           # Servicios de utilidad (ej. FileParserFactory)
│   │   └── parsers/        # Estrategias concretas (CSV, Excel)
│   ├── dto/                # DTOs compartidos (ej. PagedResultDto)
│   ├── filters/            # Filtros de excepción
│   ├── guards/             # Guardianes de seguridad
│   └── interceptors/       # Interceptores de respuesta
├── config/                 # Configuración de variables de entorno
├── entities/               # Modelos TypeORM de dominio centralizado (MySQL)
├── modules/
│   ├── auth/               # Autenticación, estrategia JWT y sesión
│   ├── grados/             # CRUD e Importación de Grados
│   ├── asignaturas/        # CRUD e Importación de Asignaturas
│   ├── profesores/         # Perfiles, Preferencias y Carga Lectiva
│   ├── aulas/              # Espacios físicos y disponibilidad
│   ├── alumnos/            # Gestión de estudiantes
│   ├── examenes/           # Programación y asignación de recursos
│   ├── calendario/         # Motor de generación y consultas globales
│   └── incidencias/        # Reporte de conflictos docentes
├── main.ts                 # Punto de entrada de la aplicación
└── app.module.ts           # Módulo raíz que orquesta todas las dependencias
```

### Frontend (Angular)

```text
src/frontend/src/app/
├── core/                   # Servicios Singleton (Auth, API), Guards e Interceptores HTTP
├── shared/                 # Componentes UI reutilizables, Pipes y Directivas
├── features/               # Módulos funcionales (Lazy Loaded)
│   ├── admin/              # Dashboard y mantenimientos del Administrador
│   ├── profesor/           # Consulta de calendario y reporte de incidencias
│   ├── alumno/             # Consulta de calendario personalizada
│   └── auth/               # Pantallas de login y gestión de cuenta
├── models/                 # Interfaces y clases de datos (espejo de DTOs del backend)
└── app.module.ts           # Módulo raíz de Angular
```

## Configuraciones Técnicas Iniciales

### 1. Seguridad y Autenticación (NestJS + Passport)
- **Estrategia**: JWT (JSON Web Tokens).
- **Hashing**: Bcrypt para el almacenamiento seguro de contraseñas.
- **Middleware**: Interceptores para inyectar automáticamente el perfil del usuario activo en las peticiones.

### 2. Comunicación API (Angular + HttpClient)
- **Base URL**: Gestionada mediante `environment.ts`.
- **Interceptores**:
    - `AuthInterceptor`: Adjunta el token JWT en las cabeceras de cada petición.
    - `ErrorInterceptor`: Captura respuestas 401/403 y gestiona la redirección al login.

### 3. Persistencia (TypeORM + MySQL)
- **Configuración**: Conexión asíncrona definida en el módulo raíz.
- **Naming Strategy**: CamelCase forzado para tablas y columnas.
- **Sincronización**: Desactivada en producción; gestionada mediante migraciones controladas.

## Esquema de Base de Datos Refinado (MySQL)

<div align=center>

|![Esquema ER](/images/02-diseño/esquema-er.svg)|
|-|
|Código fuente: [esquema-er.puml](/modelosUML/02-diseño/esquema-er.puml)|

</div>

### Definición de Tablas

```sql
-- 1. Seguridad y Acceso
CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Profesor', 'Alumno') NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Entidades Académicas y de Recursos
CREATE TABLE Grado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Aula (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    edificio VARCHAR(100) NOT NULL,
    planta VARCHAR(20) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Asignatura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    creditos INT NOT NULL,
    curso INT NOT NULL DEFAULT 1,
    cuatrimestre INT NOT NULL DEFAULT 1,
    gradoId INT NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (gradoId) REFERENCES Grado(id) ON DELETE CASCADE
);

-- 3. Perfiles de Usuario
CREATE TABLE Alumno (
    id INT PRIMARY KEY AUTO_INCREMENT,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    curso INT NOT NULL,
    gradoId INT NOT NULL,
    usuarioId INT UNIQUE NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (gradoId) REFERENCES Grado(id) ON DELETE CASCADE,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE SET NULL
);

CREATE TABLE Profesor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    usuarioId INT UNIQUE NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE SET NULL
);

-- 4. Preferencias y Asignaciones Docentes
CREATE TABLE Preferencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    diaSemana INT NOT NULL,
    horaInicio VARCHAR(5) NOT NULL,
    horaFin VARCHAR(5) NOT NULL,
    disponible TINYINT NULL DEFAULT 1,
    profesorId INT NOT NULL,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profesorId) REFERENCES Profesor(id) ON DELETE CASCADE
);

CREATE TABLE ProfesorAsignatura (
    idProfesor INT NOT NULL,
    idAsignatura INT NOT NULL,
    PRIMARY KEY (idProfesor, idAsignatura),
    FOREIGN KEY (idProfesor) REFERENCES Profesor(id) ON DELETE CASCADE,
    FOREIGN KEY (idAsignatura) REFERENCES Asignatura(id) ON DELETE CASCADE
);

-- 5. Exámenes y Gestión de Discrepancias
CREATE TABLE Examen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    fecha DATE NULL,
    hora VARCHAR(5) NULL,
    duracion INT NOT NULL,
    tipo ENUM('Ordinaria', 'Extraordinaria') NOT NULL,
    asignaturaId INT NOT NULL,
    aulaId INT NULL,
    profesorId INT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asignaturaId) REFERENCES Asignatura(id) ON DELETE CASCADE,
    FOREIGN KEY (aulaId) REFERENCES Aula(id) ON DELETE SET NULL,
    FOREIGN KEY (profesorId) REFERENCES Profesor(id) ON DELETE SET NULL
);

CREATE TABLE Incidencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('Pendiente', 'Resuelta', 'Desestimada') DEFAULT 'Pendiente',
    examenId INT NOT NULL,
    profesorId INT NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (examenId) REFERENCES Examen(id) ON DELETE CASCADE,
    FOREIGN KEY (profesorId) REFERENCES Profesor(id) ON DELETE CASCADE
);

-- Datos de inicialización
INSERT INTO Usuario (email, password, rol) VALUES ('admin@idsw2.edu', 'hash_bcrypt_admin', 'Admin');
```

## Comandos de Desarrollo

### Backend
```bash
npm install           # Instalar dependencias
npm run start:dev     # Iniciar servidor con Hot-Reload
npm run test          # Ejecutar suite de pruebas
```

### Frontend
```bash
npm install           # Instalar dependencias
ng serve              # Levantar servidor de desarrollo Angular
ng build --prod       # Generar build optimizado para producción
```

## Mapeo de Diseño a Código (Trazabilidad)

| Artefacto UML | Archivo de Código (Path Relativo) |
|---|---|
| `Usuario (Entity)` | `src/backend/entities/usuario.entity.ts` |
| `GradoController` | `src/backend/modules/grados/grados.controller.ts` |
| `AuthService` | `src/backend/modules/auth/auth.service.ts` |
| `LoginDto` | `src/backend/modules/auth/dto/login.dto.ts` |
| `LoginComponent` | `src/frontend/src/app/features/auth/login/login.component.ts` |

