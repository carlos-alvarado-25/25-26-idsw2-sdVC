# IdSw 2 > abrirAulas > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/abrirAulas/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `abrirAulas()`, especificando el flujo de consulta del inventario de espacios físicos y la estructura de datos necesaria para su correcta visualización administrativa.

## diagrama de secuencia

<div align=center>

|![Diseño: abrirAulas()](/images/02-diseño/casos-uso/abrirAulas/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/abrirAulas/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `GET`
- **Ruta**: `/aulas`
- **Nota**: Al ser una entidad de bajo volumen, se opta por un listado completo sin paginación inicial, ordenado por nombre.

#### AulaDto
```typescript
class AulaDto {
    id: number;
    codigo: string;
    nombre: string;
    capacidad: number;
    edificio: string;
    planta: string;
    tipo: string;
}
```

### Frontend (Angular)

#### AulaApiService
- `listar(): Observable<AulaDto[]>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `ListarAulasView` | `AulaListComponent` | Gestión de la UI y renderizado de la tabla de espacios. |
| `AulaController` | `AulaController` | Exposición del endpoint REST y delegación a servicio. |
| `AulaController` | `AulaService` | Recuperación de la colección de entidades del dominio. |
| `AulaRepository` | `AulaRepository` | Ejecución de `find()` sobre la tabla `aula` en MySQL. |
