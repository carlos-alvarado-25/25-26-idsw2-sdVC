# IdSw 2 > Configuración y Scaffolding del Proyecto

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Configuración**|
> |-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito
Este documento define la estructura de directorios, convenciones de nomenclatura y políticas de desarrollo para materializar la arquitectura NestJS + Angular en código fuente ejecutable.

## Estructura del Código Fuente (src)

Para garantizar la mantenibilidad y el desacoplamiento, se seguirá una estructura modular tanto en el backend como en el frontend.

### Backend (NestJS)

```text
src/backend/
├── common/             # Decoradores, filtros de excepción, utilidades globales
├── entities/           # Clases de entidad de dominio compartidas (TypeORM)
└── modules/
    ├── auth/           # Login, guardias y gestión de sesiones
    ├── grados/         # Gestión de grados académicos
    ├── asignaturas/    # Gestión de materias
    ├── profesores/     # Perfiles docentes y preferencias
    ├── aulas/          # Gestión de espacios físicos
    ├── alumnos/        # Gestión de estudiantes
    ├── examenes/       # Programación individual y asignación
    ├── calendario/     # Motor de generación y consultas globales
    └── incidencias/    # Reporte de conflictos
```

Cada módulo funcional contendrá sus propios componentes siguiendo el estándar de NestJS:
- `*.controller.ts`
- `*.service.ts`
- `dto/*.dto.ts`

### Frontend (Angular)

El directorio `src/frontend/app` seguirá la convención de componentes y servicios:

- `core/`: Servicios singleton (Auth, API Service), guardias y modelos globales.
- `shared/`: Componentes reutilizables (Botones, Tablas, Modales) y tuberías (Pipes).
- `features/`: Módulos de funcionalidad (Lazy Loaded):
    - `admin/`: Vistas de gestión para el Administrador.
    - `profesor/`: Vistas de consulta e incidencias para docentes.
    - `alumno/`: Vistas de consulta para estudiantes.
    - `auth/`: Pantallas de login y recuperación.

## Convenciones de Nomenclatura

### Base de Datos (MySQL)
- **Tablas**: CamelCase (ej: `Asignatura`, `ExamenProgramado`).
- **Columnas**: CamelCase (ej: `codigoGrado`, `fechaExamen`).
- **Claves Primarias**: Siempre `id` (autoincremental).
- **Claves Foráneas**: `id` + nombre de entidad (ej: `idGrado`).

### Código (TypeScript)
- **Clases**: PascalCase (ej: `AulaController`).
- **Métodos y Variables**: camelCase (ej: `buscarPaginados`).
- **Archivos**: kebab-case (ej: `crear-aula.dto.ts`).

## Políticas de Desarrollo

1. **Validación Obligatoria**: Todos los datos de entrada en la API deben estar tipados mediante DTOs y validados con `class-validator`.
2. **Desacoplamiento de Servicios**: Los controladores no deben contener lógica de negocio; su única responsabilidad es manejar la petición HTTP y delegar al servicio correspondiente.
3. **Manejo de Errores**: Se utilizarán los filtros de excepción de NestJS para retornar códigos de estado HTTP semánticos (400, 401, 403, 404, 500).
4. **Programación Reactiva**: En el frontend se priorizará el uso de RxJS para la gestión de flujos de datos asíncronos.
