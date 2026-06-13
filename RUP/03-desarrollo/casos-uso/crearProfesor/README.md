# IdSw 2 > crearProfesor > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearProfesor/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/crearProfesor/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Construction (Construcción)
- **Disciplina**: Implementación
- **Versión**: 1.1
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts) · [profesor.entity.ts](/src/backend/src/entities/profesor.entity.ts)
- **Frontend:** [profesor-form.component.ts](/src/frontend/src/app/features/admin/profesores/profesor-form/profesor-form.component.ts) · [profesor.service.ts](/src/frontend/src/app/core/services/profesor.service.ts)

## Descripción
Implementación del flujo de alta manual para docentes utilizando el patrón **"El Delgado"**. Captura los datos mínimos indispensables del profesor (código, nombre, email, departamento), crea atómicamente sus credenciales de acceso, y posteriormente redirige de forma automática al usuario al panel de edición avanzada para configurar su carga docente interactiva.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/profesores`
Crea un nuevo profesor tras validar las restricciones de unicidad.
- **Cuerpo (Body)**: `CrearProfesorDto` { `codigo`, `nombre`, `email`, `departamento` }.
- **Respuesta**: `201 Created` con el JSON de la entidad creada (incluyendo su ID incremental y `usuarioId`).

### Implementación
- **Validación Cruzada**: El `ProfesorService` realiza consultas previas mediante `findOneBy` para comprobar que ni el `codigo` ni el `email` suministrados colisionen con registros existentes, arrojando un `ConflictException` (409) de NestJS en caso de duplicados.
- **Validación de Formatos**: Decoradores de class-validator en `CrearProfesorDto` garantizan el cumplimiento de longitudes máximas y la estructura del correo electrónico.
- **Transaccionalidad**: El proceso utiliza `QueryRunner` de TypeORM para asegurar atomicidad completa. Si la creación del `Usuario` de acceso o de la entidad `Profesor` falla, se aplica rollback.
- **Generación de Credenciales**: Se genera automáticamente el registro en la tabla `Usuario` con rol `Profesor` y contraseña por defecto `idsw2_2026` cifrada mediante `bcrypt`.
- **Relación 1:1**: Vinculación de la entidad `Profesor` con `Usuario` a través de la columna `usuarioId`.

---

## Frontend

### Implementación
#### ProfesorFormComponent
- **Componente Único Dinámico**: El formulario se adapta dinámicamente mediante `isEditMode` evaluando la presencia de un parámetro ID en la ruta. En caso de ausencia, opera en modo creación de alta manual básica.
- **Validaciones Reactivas**: Los controles reactivos garantizan que el botón de envío permanezca deshabilitado hasta que se cumplan las restricciones sintácticas.
- **Patrón El Delgado**: Al completarse con éxito la persistencia en el backend, el componente levanta un aviso verde y ejecuta un retraso de 1 segundo antes de redirigir al Administrador a `/admin/profesores/editar/:id` (gracias al `Router` de Angular), permitiendo continuar fluidamente con su asignación de materias.

---

## Testing

### Backend (cURL)
```bash
# Alta exitosa de docente
curl -X POST http://localhost:3000/profesores \
  -H "Content-Type: application/json" \
  -d '{"codigo":"P100","nombre":"Dra. Inés Martínez","email":"ines.martinez@idsw2.edu","departamento":"Ingeniería Telemática"}'

# Intento con correo duplicado (retorna 409 Conflict)
curl -X POST http://localhost:3000/profesores \
  -H "Content-Type: application/json" \
  -d '{"codigo":"P101","nombre":"Dr. Carlos Pérez","email":"ines.martinez@idsw2.edu","departamento":"Física Computacional"}'
```
