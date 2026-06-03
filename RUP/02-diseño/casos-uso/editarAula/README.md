# IdSw 2 > editarAula > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarAula/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `editarAula()`, estableciendo el flujo de actualización incremental mediante el método `PATCH` y el estado singular de edición para optimizar la experiencia administrativa de los espacios físicos.

## diagrama de secuencia

<div align=center>

|![Diseño: editarAula()](/images/02-diseño/casos-uso/editarAula/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/editarAula/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoints
1. **Carga**: `GET /aulas/:id` -> Retorna `AulaDto`.
2. **Actualización**: `PATCH /aulas/:id` -> Recibe `UpdateAulaDto`.

#### UpdateAulaDto
```typescript
class UpdateAulaDto {
    codigo?: string;
    nombre?: string;
    capacidad?: number;
    edificio?: string;
    planta?: string;
    tipo?: string;
}
```

### Frontend (Angular)

#### AulaApiService
- `obtener(id: number): Observable<AulaDto>`
- `actualizar(id: number, dto: UpdateAulaDto): Observable<void>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EditarAulaView` | `AulaFormComponent` | Gestión del estado singular de edición y persistencia incremental. |
| `AulaController` | `AulaController` | Manejo de peticiones de recuperación y actualización parcial. |
| `AulaController` | `AulaService` | Orquestación de la actualización en el dominio y validación de unicidad si el código cambia. |
| `AulaRepository` | `AulaRepository` | Sincronización de cambios en la base de datos MySQL mediante `update()`. |
