<div align="right">

[![](https://img.shields.io/badge/-Inicio-0A3B64?style=for-the-badge&logo=github&logoColor=white)](/README.md)
[![](https://img.shields.io/badge/-Modelo_del_Dominio-0A3B64?style=for-the-badge&logo=drawio&logoColor=white)](/documentos/00-modelo-del-dominio/README.md)
[![](https://img.shields.io/badge/-Actores_Y_Casos_de_Uso-0A3B64?style=for-the-badge&logo=use-case&logoColor=white)](/documentos/01-casos-de-uso/0-Actores/README.md)
[![](https://img.shields.io/badge/-Diagramas_de_Contexto-0A3B64?style=for-the-badge&logo=flowchart&logoColor=white)](/documentos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
[![](https://img.shields.io/badge/-Detalle_de_Casos_de_Uso-0A3B64?style=for-the-badge&logo=notepad&logoColor=white)](/documentos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Prototipos-0A3B64?style=for-the-badge&logo=figma&logoColor=white)](/documentos/01-casos-de-uso/5-Prototipo/README.md)
[![](https://img.shields.io/badge/-Priorización-0A3B64?style=for-the-badge&logo=priority&logoColor=white)](/documentos/01-casos-de-uso/3-PriorizarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Sesiones-0A3B64?style=for-the-badge&logo=google-meet&logoColor=white)](/documentos/03-sesiones/README.md)
[![](https://img.shields.io/badge/-IA-0A3B64?style=for-the-badge&logo=openai&logoColor=white)](/IA/README.md)

</div>

# Casos de Uso

## Actores y casos de uso identificados

Los actores identificados son:

- **Administrador**: responsable de la gestión de datos base y de la generación, validación del calendario de exámenes.
- **Profesor**: encargado de consultar el calendario publicado, descargar el calendario y comunicar incidencias relacionadas con sus exámenes.
- **Alumno**: usuario final que consulta y descarga el calendario de exámenes disponible.

<div align=center>

|                                        **Administrador**                                        |                                     **Profesor**                                      |                                    **Alumno**                                     |
| :---------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------: |
|       ![](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministrador.svg)        |       ![](/documentos/01-casos-de-uso/1-CasosDeUso/1-Profesor/CdUProfesor.svg)        |       ![](/documentos/01-casos-de-uso/1-CasosDeUso/2-Alumno/CdUAlumno.svg)        |
| [Código fuente](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministrador.puml) | [Código fuente](/documentos/01-casos-de-uso/1-CasosDeUso/1-Profesor/CdUProfesor.puml) | [Código fuente](/documentos/01-casos-de-uso/1-CasosDeUso/2-Alumno/CdUAlumno.puml) |

> Debido al alto número de casos de uso, el actor **Administrador** se ha representado mediante
> **cinco diagramas independientes**, agrupados por área funcional, manteniendo el modelo original.

| Área funcional                   |                                                               Diagrama                                                               | Código (.puml)                                                                                                       |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------- |
| **Administración Académica**     | <div align="center">![](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAcadémica.svg)</div>  | [Ver código](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAcadémica.puml)  |
| **Administración de Exámenes**   |  <div align="center">![](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónExámenes.svg)</div>  | [Ver código](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónExámenes.puml)   |
| **Administración de Profesores** | <div align="center">![](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónProfesores.svg)</div> | [Ver código](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónProfesores.puml) |
| **Administración de Aulas**      |   <div align="center">![](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAulas.svg)</div>    | [Ver código](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAulas.puml)      |
| **Administración de Alumnos**    |  <div align="center">![](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAlumnos.svg)</div>   | [Ver código](/documentos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAlumnos.puml)    |

</div>

---

## Diagramas de contexto

Los diagramas de contexto representan el **entorno del sistema** y la **navegación entre estados** para cada actor, modelados como máquinas de estados. Estos diagramas permiten comprender las precondiciones, estados alcanzables y transiciones válidas según el rol.

<div align=center>

|                                                   **Administrador**                                                    |                                                 **Profesor**                                                 |                                                **Alumno**                                                |
| :--------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
|       ![](/documentos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)        |       ![](/documentos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)        |       ![](/documentos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)        |
| [Código fuente](/documentos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.puml) | [Código fuente](/documentos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.puml) | [Código fuente](/documentos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.puml) |

</div>

---

## Detalle y prototipo de los casos de uso

En este apartado se presentan los **diagramas detallados y el prototipo de cada caso de uso**, modelados como **máquinas de estados**, donde se describe paso a paso la interacción entre el actor y el sistema.

Perfecto, aquí tienes la versión corregida con todos los cambios que hemos realizado:

### Diagramas detallados — Administrador

| Administración de datos base                                                                                                | Administración del calendario                                                                                                                       | Administración de entidades                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [importarProfesores()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/importarProfesores/importarProfesores.md)    | [generarCalendario()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/generarCalendario/generarCalendario.md)                               | [abrirGrados()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirGrados/abrirGrados.md)                      |
| [importarAulas()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAulas/importarAulas.md)                   | [listarConflictosExamenes()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/listarConflictosExamenes/listarConflictosExamenes.md)          | [abrirAsignaturas()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAsignaturas/abrirAsignaturas.md)       |
| [importarAsignaturas()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAsignaturas/importarAsignaturas.md) | [consultarCalendario()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/consultarCalendario/consultarCalendario.md)                         | [abrirExamenes()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirExamenes/abrirExamenes.md)                |
| [importarGrados()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/importarGrados/importarGrados.md)                | [descargarCalendarioExamenes()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/descargarCalendarioExamenes/descargarCalendarioExamenes.md) | [abrirProfesores()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirProfesores/abrirProfesores.md)          |
| [importarAlumnos()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAlumnos/importarAlumnos.md)             | [asignarProfesorAExamen()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/asignarProfesorAExamen/asignarProfesorAExamen.md)                | [abrirAulas()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAulas/abrirAulas.md)                         |
|                                                                                                                             |                                                                                                                                                     | [abrirAlumnos()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAlumnos/abrirAlumnos.md)                   |
|                                                                                                                             |                                                                                                                                                     | [crearGrado()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/crearGrado/crearGrado.md)                         |
|                                                                                                                             |                                                                                                                                                     | [crearAsignatura()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAsignatura/crearAsignatura.md)          |
|                                                                                                                             |                                                                                                                                                     | [crearExamen()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/crearExamen/crearExamen.md)                      |
|                                                                                                                             |                                                                                                                                                     | [crearProfesor()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/crearProfesor/crearProfesor.md)                |
|                                                                                                                             |                                                                                                                                                     | [crearAula()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAula/crearAula.md)                            |
|                                                                                                                             |                                                                                                                                                     | [crearAlumno()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAlumno/crearAlumno.md)                      |
|                                                                                                                             |                                                                                                                                                     | [editarGrado()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/editarGrado/editarGrado.md)                      |
|                                                                                                                             |                                                                                                                                                     | [editarAsignatura()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAsignatura/editarAsignatura.md)       |
|                                                                                                                             |                                                                                                                                                     | [editarExamen()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/editarExamen/editarExamen.md)                   |
|                                                                                                                             |                                                                                                                                                     | [editarProfesor()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/editarProfesor/editarProfesor.md)             |
|                                                                                                                             |                                                                                                                                                     | [editarAula()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAula/editarAula.md)                         |
|                                                                                                                             |                                                                                                                                                     | [editarAlumno()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAlumno/editarAlumno.md)                   |
|                                                                                                                             |                                                                                                                                                     | [eliminarGrado()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarGrado/eliminarGrado.md)                |
|                                                                                                                             |                                                                                                                                                     | [eliminarAsignatura()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAsignatura/eliminarAsignatura.md) |
|                                                                                                                             |                                                                                                                                                     | [eliminarExamen()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarExamen/eliminarExamen.md)             |
|                                                                                                                             |                                                                                                                                                     | [eliminarProfesor()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarProfesor/eliminarProfesor.md)       |
|                                                                                                                             |                                                                                                                                                     | [eliminarAula()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAula/eliminarAula.md)                   |
|                                                                                                                             |                                                                                                                                                     | [eliminarAlumno()](/documentos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAlumno/eliminarAlumno.md)             |

---

### Diagramas detallados — Profesor

| Gestión de calendario                                                                                                                          | Gestión de incidencias                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [consultarCalendario()](/documentos/01-casos-de-uso/5-Prototipo/1-Profesor/consultarCalendario/consultarCalendario.md)                         | [comunicarIncidenciasHorario()](/documentos/01-casos-de-uso/5-Prototipo/1-Profesor/comunicarIncidenciasHorario/comunicarIncidenciasHorario.md) |
| [descargarCalendarioExamenes()](/documentos/01-casos-de-uso/5-Prototipo/1-Profesor/descargarCalendarioExamenes/descargarCalendarioExamenes.md) |                                                                                                                                                |

---

### Diagramas detallados — Alumno

| Consulta de calendario                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------- |
| [consultarCalendario()](/documentos/01-casos-de-uso/5-Prototipo/2-Alumno/consultarCalendario/consultarCalendario.md)                         |
| [descargarCalendarioExamenes()](/documentos/01-casos-de-uso/5-Prototipo/2-Alumno/descargarCalendarioExamenes/descargarCalendarioExamenes.md) |

---

### Diagramas detallados — Generales

| Iniciar/cerrar Sesión                                                                                         |
| ------------------------------------------------------------------------------------------------------------- |
| [iniciarSesion()](/documentos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/iniciarSesion/iniciarSesion.md) |
| [cerrarSesion()](/documentos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)    |

---

## Totales por actor:

- **Administrador:** 34 prototipos
- **Profesor:** 3 prototipos
- **Alumno:** 2 prototipos
- **TOTAL:** 39 prototipos

_Sumar 2 de iniciar/cerrar sesión_
