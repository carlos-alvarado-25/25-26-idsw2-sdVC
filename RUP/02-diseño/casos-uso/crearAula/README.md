# IdSw 2 > crearAula > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/crearAula/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-03
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `crearAula()`, aplicando el patrón "El Delgado" para una creación rápida de recursos físicos y la transición automática al modo de edición completa, asegurando la unicidad del identificador de aula.

## diagrama de secuencia

<div align=center>

|![Diseño: crearAula()](/images/02-diseño/casos-uso/crearAula/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/crearAula/secuencia.puml)|

</div>

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/aulas`

#### CreateAulaDto
```typescript
class CreateAulaDto {
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
- `crear(dto: CreateAulaDto): Observable<AulaDto>`

#### Navegación
Tras recibir un HTTP 201, el componente redirige mediante `router.navigate(['/aulas/edit', id])`.

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `CrearAulaView` | `AulaFormComponent` | Interfaz de captura de datos y orquestación de la navegación post-creación. |
| `AulaController` | `AulaController` | Exposición del endpoint de creación y validación de DTO. |
| `AulaController` | `AulaService` | Validación de unicidad de `codigo` y orquestación de la persistencia. |
| `AulaRepository` | `AulaRepository` | Inserción física en la base de datos MySQL y generación de ID. |
