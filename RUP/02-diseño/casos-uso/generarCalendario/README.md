# IdSw 2 > generarCalendario > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/generarCalendario/README.md)|**Diseño**|Desarrollo|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 2.0 (Desacoplado)
- **Fecha**: 2026-06-06
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `generarCalendario()`. Con el fin de mitigar los code smells de **Baja Cohesión** e **Invasión de Incumbencias (Feature Envy)** propios de un enfoque centralizado, se introduce un patrón de **Invención Pura** (`CalendarioEngine`) y se aplica el **Patrón Experto en Información** en las entidades `Aula` y `Profesor`. Esto garantiza un motor de calendarización 100% testeable de forma aislada en memoria.

## diagrama de secuencia

<div align=center>

|![Diseño: generarCalendario()](/images/02-diseño/casos-uso/generarCalendario/secuencia.svg)|
|-|
|Código fuente: [secuencia.puml](/modelosUML/02-diseño/casos-uso/generarCalendario/secuencia.puml)|

</div>

## diseño estructural y delegación de responsabilidades

Para asegurar un diseño modular óptimo, se distribuyen las responsabilidades de la siguiente manera:

### 1. Motor de Calendarización (`CalendarioEngine`)
*Estereotipo: Invención Pura (Pure Fabrication)*  
Es una clase pura de dominio en memoria, libre de dependencias con TypeORM o el framework NestJS. Su única responsabilidad es ejecutar el algoritmo combinatorial de calendarización.
*   **`generar(config: GeneracionConfig): GeneracionResultDto`**: Entrada principal. Orquesta la calendarización en base a los datos provistos en memoria.
*   **`generarRanurasTemporales(inicio: string, fin: string, franjas: string[]): Slot[]`**: Genera la cuadrícula de días hábiles y franjas para asignar exámenes.
*   **`buscarSlotOptimo(...)`**: Busca la combinación de slot y aula válida invocando los métodos expertos de `Aula` y `Profesor`.
*   **`registrarAsignacion(...)`**: Reserva en memoria el aula y profesor en el slot asignado para prevenir cruces en las siguientes iteraciones.

### 2. Entidad `Aula`
*Estereotipo: Entidad / Experto en Información (Espacio)*  
Encapsula la validación de sus capacidades físicas e idoneidad:
*   **`tieneCapacidadSuficiente(cantidadAlumnos: number): boolean`**: Compara si `this.capacidad >= cantidadAlumnos`.
*   **`esTipoAdecuado(tipoRequerido: string): boolean`**: Valida si el tipo de aula coincide con las necesidades del examen.
*   **`estaDisponibleEn(fecha: string, franja: string, examenesAsignados: Examen[]): boolean`**: Compara contra la lista de exámenes que se están programando para ver si su identificador `aulaId` ya se encuentra ocupado en ese slot.

### 3. Entidad `Profesor`
*Estereotipo: Entidad / Experto en Información (Docente)*  
Encapsula la lógica de disponibilidad horaria y cruces docentes:
*   **`estaDisponibleEn(fecha: string, franja: string, preferencias: Preferencia[]): boolean`**: Compara el slot propuesto contra sus exclusiones de horario registradas en `Preferencia`.
*   **`tieneCruceHorario(fecha: string, franja: string, examenesAsignados: Examen[]): boolean`**: Comprueba que no esté supervisando simultáneamente otro examen (`examen.profesorId === this.id`) en el slot propuesto.

---

## especificación de contratos y DTOs

### Backend (NestJS)

#### Endpoint
- **Método**: `POST`
- **Ruta**: `/calendario/generar`

#### GenerarCalendarioDto
```typescript
class GenerarCalendarioDto {
    @IsDateString()
    fechaInicio: string;
    
    @IsDateString()
    fechaFin: string;
    
    @IsArray()
    @IsString({ each: true })
    franjasHorarias: string[];
}
```

#### GeneracionResultDto
```typescript
class GeneracionResultDto {
    exito: boolean;
    totalExamenes: number;
    programados: number;
    noProgramados: number;
    conflictos: ConflictInfo[];
}

interface ConflictInfo {
    examenId: number;
    examenCodigo: string;
    asignaturaNombre: string;
    motivo: string;
}
```

### Frontend (Angular)

#### CalendarioApiService
- `generarCalendario(dto: GenerarCalendarioDto): Observable<GeneracionResultDto>`

---

## correspondencia con análisis

| Clase de Análisis | Componente de Diseño | Responsabilidad Técnica |
|-------------------|----------------------|--------------------------|
| `GenerarCalendarioView` | `GenerarCalendarioComponent` (Angular) | Captura de configuración y presentación de estadísticas/conflictos. |
| - | `CalendarioApiService` (Angular) | Invocación de la API del motor de calendarización. |
| `CalendarioController` | `CalendarioController` (NestJS) | Exposición del endpoint `POST /calendario/generar`. |
| - | `CalendarioService` (NestJS) | Coordinador del caso de uso. Carga los datos de MySQL, invoca al `CalendarioEngine` y persiste el bloque de exámenes programados. |
| - | `CalendarioEngine` (NestJS/Domain) | Motor de emparejamiento combinatorial libre de base de datos. |
| `Examen` | `Examen` (Entity) | Encapsula el resultado de la asignación. |
| `AulaRepository` / `Aula` | `AulaRepository` / `Aula` (Entity) | Provisión de capacidades físicas y verificación de disponibilidad experta. |
| `PreferenciaRepository` / `Profesor` | `PreferenciaRepository` / `Profesor` (Entity) | Provisión de exclusiones horarias y comprobación de cruces de supervisor experto. |

## referencias

- [Análisis: generarCalendario](/RUP/01-analisis/casos-uso/generarCalendario/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
