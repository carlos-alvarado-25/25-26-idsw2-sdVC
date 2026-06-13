export class TimeUtils {
  /**
   * Convierte una cadena de hora "HH:MM" a minutos transcurridos desde el inicio del día.
   */
  static convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convierte minutos transcurridos a una cadena de hora "HH:MM".
   */
  static minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  /**
   * Determina si dos intervalos horarios se solapan matemáticamente.
   */
  static hasOverlap(
    startA: number,
    endA: number,
    startB: number,
    endB: number,
  ): boolean {
    return startA < endB && startB < endA;
  }
}
