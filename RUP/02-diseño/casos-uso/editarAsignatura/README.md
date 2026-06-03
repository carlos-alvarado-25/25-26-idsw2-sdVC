# IdSw 2 > editarAsignatura > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/editarAsignatura/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/editarAsignatura/README.md)|Pruebas|

> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `editarAsignatura()`, estableciendo el flujo de actualización incremental mediante el método `PATCH` y la navegación por estado singular en el frontend para optimizar la experiencia de usuario.

## diagrama de secuencia

<div align=center>

|![Diseño: editarAsignatura()](/images/02-diseño/casos-uso/editarAsignatura/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/editarAsignatura/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoints
1. **Carga**: `GET /asignaturas/:id` -> Retorna `AsignaturaDto`.
2. **Actualización**: `PATCH /asignaturas/:id` -> Recibe `UpdateAsignaturaDto`.

#### UpdateAsignaturaDto
```typescript
class UpdateAsignaturaDto {
    codigo?: string;
    nombre?: string;
    curso?: number;
    gradoId?: number;
}
```

### Frontend (Angular)

#### AsignaturaApiService
- `obtener(id: number): Observable<AsignaturaDto>`
- `actualizar(id: number, dto: UpdateAsignaturaDto): Observable<void>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `EditarAsignaturaView` | `AsignaturaFormComponent` | Gestión del estado singular y persistencia reactiva. |
| `AsignaturaController` | `AsignaturaController` | Manejo de peticiones de recuperación y actualización parcial. |
| `AsignaturaController` | `AsignaturaService` | Orquestación de la actualización en el dominio. |
| `AsignaturaRepository` | `AsignaturaRepository` | Sincronización de cambios en la base de datos MySQL. |
