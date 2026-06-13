export class TimeUtils {
  static convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  static minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  static hasOverlap(
    startA: number,
    endA: number,
    startB: number,
    endB: number,
  ): boolean {
    return startA < endB && startB < endA;
  }
}
