# IdSw 2 > eliminarAlumno > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/eliminarAlumno/README.md)|**Diseño**|[Desarrollo](/RUP/03-desarrollo/casos-uso/eliminarAlumno/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.1
- **Fecha**: 2026-06-04
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `eliminarAlumno()`, especificando el flujo de borrado directo mediante confirmación del Administrador y la ejecución de la eliminación física en la base de datos MySQL, cumpliendo estrictamente con el análisis de colaboración.

## diagrama de secuencia

<div align=center>

|![Diseño: eliminarAlumno()](/images/02-diseño/casos-uso/eliminarAlumno/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/eliminarAlumno/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `DELETE`
- **Ruta**: `/alumnos/:id`
- **Respuesta**: `200 OK`

### Frontend (Angular)

#### AlumnoApiService
- `eliminar(id: number): Observable<void>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EliminarAlumnoView` | `ConfirmDialog` | Captura de confirmación del Administrador. |
| `AlumnoController` | `AlumnoController` | Exposición del endpoint de eliminación. |
| `AlumnoController` | `AlumnoService` | Orquestación de la persistencia destructiva. |
| `AlumnoRepository` | `AlumnoRepository` | Eliminación física del registro en MySQL. |
