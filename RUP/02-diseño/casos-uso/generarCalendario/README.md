# IdSw 2 > generarCalendario > Diseño

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/generarCalendario/README.md)|**Diseño**|[⚙️ Desarrollo](/RUP/03-desarrollo/casos-uso/generarCalendario/README.md)|Pruebas|
> |-|-|-|-|-|-|-|

## información del artefacto

- **Proyecto**: IdSw 2 - Sistema de Generación de Calendarios de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 2.1 (Optimizado)
- **Fecha**: 2026-06-13
- **Autor**: Gemini CLI

## propósito

Realización del diseño detallado para el caso de uso `generarCalendario()`. Con el fin de mitigar los code smells de **Baja Cohesión** e **Invasión de Incumbencias (Feature Envy)** propios de un enfoque centralizado, se introduce un patrón de **Invención Pura** (`CalendarioEngine`) y se aplica el **Patrón Experto en Información** en las entidades `Aula` y `Profesor`. Esto garantiza un motor de calendarización 100% testeable de forma aislada en memoria. Se optimiza el cálculo del algoritmo de dispersión acoplándolo al Grado y Curso académico para evitar restricciones sobredimensionadas.

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
*   **`generar(config: GeneracionConfig): GeneracionResultDto`**: Entrada principal. Orquesta la calendarización en base a los datos provistos en memoria (incluyendo `examenesExistentes` para evitar colisiones con ejecuciones previas).
*   **`generarRanurasTemporales(inicio: string, fin: string, franjas: string[]): Slot[]`**: Genera la cuadrícula de días hábiles y franjas para asignar exámenes.
*   **`buscarSlotOptimo(...)`**: Busca la combinación de slot, aula y profesor óptima, evaluando de forma exhaustiva los candidatos válidos y puntuando cada opción en base a su dispersión temporal para exámenes del mismo Grado y Curso, de modo que se maximice la separación en días.
*   **`calcularPuntuacionDispersion(...)`**: Evalúa la proximidad en días de un slot propuesto con otros exámenes ya asignados al mismo Grado y Curso académico, aplicando penalizaciones por cercanía (mismo día: -100, día consecutivo: -50, etc.).
*   **`registrarAsignacion(...)`**: Reserva en memoria el aula y profesor en el slot asignado para prevenir cruces en las siguientes iteraciones.

### 2. Entidad `Aula`
*Estereotipo: Entidad / Experto en Información (Espacio)*  
Encapsula la validación de sus capacidades físicas e idoneidad:
*   **`tieneCapacidadSuficiente(cantidadAlumnos: number): boolean`**: Compara si `this.capacidad >= cantidadAlumnos`.
*   **`esTipoAdecuado(tipoRequerido: string): boolean`**: Valida si el tipo de aula coincide con las necesidades del examen.
*   **`estaDisponibleEn(fecha: string, franja: string, examenesAsignados: Examen[]): boolean`**: Compara contra la lista de exámenes que se están programando para ver si su identificador `aulaId` ya se encuentra ocupado en ese slot. **Nota de Auditoría (Intervalo Temporal)**: En lugar de comparar coincidencias exactas de hora de inicio, realiza una intersección matemática de intervalos en minutos (`slotStart < exEnd && exStart < slotEnd`), evitando cruces con exámenes de diferente hora de inicio o duración.

### 3. Entidad `Profesor`
*Estereotipo: Entidad / Experto en Información (Docente)*  
Encapsula la lógica de disponibilidad horaria y cruces docentes:
*   **`estaDisponibleEn(fecha: string, franja: string, preferencias: Preferencia[]): boolean`**: Compara el slot propuesto contra sus exclusiones de horario registradas en `Preferencia`.
*   **`tieneCruceHorario(fecha: string, franja: string, examenesAsignados: Examen[]): boolean`**: Comprueba que no esté supervisando simultáneamente otro examen en el slot propuesto. **Nota de Auditoría (Intervalo Temporal)**: Implementa la intersección matemática de intervalos en minutos para prevenir el doble booking físico.
*   **`puedeImpartirAsignatura(asignaturaId: number): boolean`**: Comprueba si la asignatura pertenece a las asignaturas que el profesor puede impartir. **Nota de Auditoría (Ley de Demeter)**: Evita que el `CalendarioEngine` consulte la estructura interna del array de asignaturas del profesor, delegando la responsabilidad en el Experto en Información (`Profesor`).

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
    propuesta?: AsignacionProposedDto[];
}

interface ConflictInfo {
    examenId: number;
    examenCodigo: string;
    asignaturaNombre: string;
    motivo: string;
}

interface AsignacionProposedDto {
    examenId: number;
    fecha: string;
    hora: string;
    aulaId: number;
    profesorId: number | null;
}
```

#### ConfirmarCalendarioDto
- **Método**: `POST`
- **Ruta**: `/calendario/confirmar`
```typescript
class ConfirmarCalendarioDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AsignacionProposedDto)
    asignaciones: AsignacionProposedDto[];
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

## Auditoría de Diseño y Refactorizaciones

Durante la sesión del 07/06/2026, se realizó una auditoría y refactorización del código de `generarCalendario` para asegurar el cumplimiento estricto de las directrices arquitectónicas y la usabilidad del sistema:

1. **Ley de Demeter (Decoupling)**: 
   - Se identificó que `CalendarioEngine` consultaba directamente el array de asignaturas del profesor (`profesor.asignaturas.some(...)`). Esto violaba la Ley de Demeter y el principio de encapsulamiento.
   - **Solución**: Se encapsuló la validación agregando el método `puedeImpartirAsignatura(asignaturaId)` en la entidad `Profesor` (Experto en Información). El motor ahora delega la consulta a este método.
   
2. **Mitigación de Solapamiento Temporal Físico**:
   - Anteriormente, el motor comprobaba coincidencias exactas de hora de inicio (`examen.hora === horaSlot`). Esto provocaba un bug potencial si dos exámenes en la misma aula/profesor tenían diferentes horas de inicio u horas solapadas por su duración.
   - **Solución**: Se modificaron `Aula.estaDisponibleEn()` y `Profesor.tieneCruceHorario()` para usar una fórmula matemática de intersección de intervalos:
     $$\text{slotStart} < \text{exEnd} \quad \land \quad \text{exStart} < \text{slotEnd}$$
     Las horas se transforman a minutos desde la medianoche usando la función auxiliar `convertTimeToMinutes(timeStr)` garantizando una protección del 100% contra el doble booking.

3. **Heurística de Dispersión Académica por Grado**:
   - El motor original asignaba el primer slot disponible de forma secuencial y codiciosa, lo que concentraba la mayoría de los exámenes de un mismo Grado en un par de días (aglomeración).
   - **Solución**: Se modificó `buscarSlotOptimo()` en `CalendarioEngine` para que evalúe y asigne puntuaciones de penalización a todos los huecos libres válidos basándose en la distancia temporal (en días) con otros exámenes ya asignados al mismo `gradoId` (mismo día: -100, día consecutivo: -50, 2 días de separación: -20, 3 días de separación: -5). Se elige la combinación de slot y aula que obtenga la puntuación máxima (menor penalización).

## referencias

- [Análisis: generarCalendario](/RUP/01-analisis/casos-uso/generarCalendario/README.md)
- [Diagrama de Clases de Diseño Global](/RUP/02-diseño/clases-diseño.md)
