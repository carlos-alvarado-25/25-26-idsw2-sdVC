# IdSw 2 > Disciplina de Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

Esta sección documenta la **Disciplina de Desarrollo** (Implementación) del sistema, detallando la codificación de los componentes del backend (NestJS) y frontend (Angular) basándose en los artefactos de diseño.

## Repositorio de Código Fuente

El código ejecutable se encuentra en el directorio raíz [/src](/src):
- [/src/backend](/src/backend): API REST con NestJS y TypeORM.
- [/src/frontend](/src/frontend): Aplicación SPA con Angular.

## Casos de Uso Implementados

*(Se irá poblando a medida que se completen las implementaciones reales)*

### Comunes
- [iniciarSesion](casos-uso/iniciarSesion/README.md) ✅
- [cerrarSesion](casos-uso/cerrarSesion/README.md) ✅

### Administrador
- [abrirGrados](casos-uso/abrirGrados/README.md) ✅
- [crearGrado](casos-uso/crearGrado/README.md) ✅
- [editarGrado](casos-uso/editarGrado/README.md) ✅
- [eliminarGrado](casos-uso/eliminarGrado/README.md) ✅
- [importarGrados](casos-uso/importarGrados/README.md) ✅

#### Gestión de Asignaturas
- [abrirAsignaturas](casos-uso/abrirAsignaturas/README.md) ✅
- [crearAsignatura](casos-uso/crearAsignatura/README.md) ✅
- [editarAsignatura](casos-uso/editarAsignatura/README.md) ✅
- [eliminarAsignatura](casos-uso/eliminarAsignatura/README.md) ✅
- [importarAsignaturas](casos-uso/importarAsignaturas/README.md) ✅

#### Gestión de Aulas
- [abrirAulas](casos-uso/abrirAulas/README.md) ✅
- [crearAula](casos-uso/crearAula/README.md) ✅
- [editarAula](casos-uso/editarAula/README.md) ✅
- [eliminarAula](casos-uso/eliminarAula/README.md) ✅
- [importarAulas](casos-uso/importarAulas/README.md) ✅


## Estándares de Codificación
Se siguen las directrices definidas en el [Documento de Configuración del Proyecto](/RUP/02-diseño/configuracion-proyecto.md).
