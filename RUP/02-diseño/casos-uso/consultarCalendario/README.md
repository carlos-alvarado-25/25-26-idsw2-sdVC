# IdSw 2 > consultarCalendario > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/consultarCalendario/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/consultarCalendario/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Gemini CLI

## Propósito

Realización técnica del caso de uso `consultarCalendario()` y de la transición `completarConsulta()` para la plataforma NestJS + Angular. Este componente unifica la visualización de exámenes para los tres actores del sistema (Administradores, Profesores y Alumnos) en una vista interactiva de calendario (rejilla mensual, semanal y diaria), restringiendo los datos visualizados según las políticas de seguridad y pertenencia de cada rol.

## Diagrama de Secuencia de Diseño

<div align=center>

|![Diseño: consultarCalendario()](/images/02-diseño/casos-uso/consultarCalendario/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/consultarCalendario/secuencia.puml)|

</div>

## Mapeo de Clases de Análisis a Diseño

| Clase de Análisis | Clase de Diseño (Frontend) | Clase de Diseño (Backend) |
|---|---|---|
| ConsultarCalendarioView | `ConsultarCalendarioComponent` (Angular) | - |
| - | `ExamenService` (Angular) — método `getCalendario` | - |
| CalendarioController | - | `ExamenController` (NestJS) — método `findCalendario` |
| ExamenRepository | - | `ExamenRepository` (TypeORM) |
| :Session | `AuthService` (Angular) | - |
| Examen | `Examen` (interface frontend) | `Examen` (Entity backend) |
| Asignatura | `Asignatura` (interface frontend) | `Asignatura` (Entity backend) |
| Grado | `Grado` (interface frontend) | `Grado` (Entity backend) |

## Detalles Técnicos

### 1. Endpoint de Consulta Contextual del Calendario

Para evitar N+1 queries y mantener la cohesión de negocio, se define un endpoint único en el controlador de exámenes que procesa los filtros temporales, los filtros dimensionales (Grado/Asignatura) y las políticas de visibilidad por rol.

- **Endpoint**: `GET /examenes/calendario`
- **Query Parameters**:
  - `fechaInicio`: `string` (formato `YYYY-MM-DD`, opcional)
  - `fechaFin`: `string` (formato `YYYY-MM-DD`, opcional)
  - `gradoId`: `number` (opcional, filtro manual)
  - `asignaturaId`: `number` (opcional, filtro manual)
  - `rol`: `string` (obtenido del payload JWT, 'Admin' | 'Profesor' | 'Alumno')
  - `email`: `string` (obtenido del payload JWT para resolver la identidad en el dominio)

#### Lógica de Restricción en `ExamenService.findCalendario()`

El backend recupera y filtra los exámenes programados (`fecha IS NOT NULL`) aplicando las siguientes cláusulas condicionales de SQL según el rol:

1. **Admin**:
   - Sin restricciones de pertenencia.
   - SQL: `WHERE e.fecha BETWEEN :fechaInicio AND :fechaFin`

2. **Profesor**:
   - Se consulta la tabla `Profesor` por email para obtener el `profesorId`.
   - SQL: `WHERE e.fecha BETWEEN :fechaInicio AND :fechaFin AND e.profesorId = :profesorId`

3. **Alumno**:
   - Se consulta la tabla `Alumno` por email para obtener el `gradoId` en el que está matriculado.
   - SQL: `WHERE e.fecha BETWEEN :fechaInicio AND :fechaFin AND a.gradoId = :gradoId` (mediante un `JOIN Asignatura a`)

*Nota*: Si se proporcionan filtros manuales adicionales (`gradoId` o `asignaturaId`), se concatenan a la consulta mediante condiciones `AND` adicionales. Si un `Alumno` intenta filtrar por un `gradoId` diferente al suyo, el backend forzará la visualización únicamente de su grado para evitar fugas de información.

### 2. Componente de Frontend: `ConsultarCalendarioComponent`

**Ruta**: `/calendario/consultar`

#### Características de la Interfaz
- **Selectores de Rango Temporal**: Botones para alternar entre vista **Mensual**, **Semanal** y **Diaria**, con flechas para avanzar/retroceder en el tiempo.
- **Filtros Académicos**:
  - Desplegable de Grados (deshabilitado o invisible para Alumnos, ya que su vista está pre-filtrada por su grado de matrícula).
  - Desplegable de Asignaturas (filtradas dinámicamente según el Grado seleccionado).
- **Rejilla del Calendario (Grid CSS)**:
  - Cajas de días que distribuyen los exámenes según su `fecha` y `hora`.
  - Cada tarjeta de examen debe mostrar de forma premium: Código y Nombre de la Asignatura, Aula, Horario (Hora y Duración) y Profesor asignado.
- **Control de Navegación (Transiciones)**:
  - Botón **"Volver al Menú"** (`completarConsulta()`) que redirige a `/home`.
  - Botón **"Descargar Calendario"** (prepara para el siguiente caso de uso `descargarCalendarioExamenes()`).
  - Para Profesores: Enlace de **"Comunicar Incidencia"** sobre el examen (prepara para el caso de uso `comunicarIncidenciasHorario()`).

### 3. Integración en el Menú Principal (`HomeComponent`)

Se añade el botón/tarjeta de consulta de calendario en `HomeComponent` adaptado a los roles:
- **Admin**: Acceso a la consulta desde la tarjeta de Calendario.
- **Profesor y Alumno**: Única tarjeta visible "Consultar Calendario" para simplificar su flujo de entrada directa.

### 4. Optimización de Rendimiento y Algoritmos de Consulta

Durante la fase de auditoría se introdujeron dos optimizaciones de diseño técnico para garantizar la eficiencia del sistema:

1. **Evitar I/O Redundante en el Backend**: El servicio `ExamenService.findCalendario()` resuelve la entidad `Alumno` y su `gradoId` a partir del email del usuario una única vez al inicio del método. Este valor se reutiliza tanto en la restricción de visibilidad del rol como en el posterior filtrado de grado, previniendo hits adicionales a la base de datos MySQL.
2. **Complejidad Lineal O(N) en Renderizado**: En el componente Angular, se reemplazó la búsqueda repetitiva por celda ($O(C \times N)$ usando `.filter` en cada día de la rejilla mensual/semanal) por un pre-agrupamiento de exámenes en un `Map` indexado por fecha en tiempo lineal $O(N)$. Así, la renderización de cada celda del calendario realiza un acceso instantáneo en $O(1)$.

## Referencias

- [Análisis: consultarCalendario()](/RUP/01-analisis/casos-uso/consultarCalendario/README.md)
- [Requisitos: Detalle de Casos de Uso del Alumno](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/2-Alumno/README.md)
- [Requisitos: Detalle de Casos de Uso del Profesor](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/1-Profesor/README.md)
