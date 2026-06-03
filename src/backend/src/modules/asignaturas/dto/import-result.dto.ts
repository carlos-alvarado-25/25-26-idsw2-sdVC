export class ImportResultDto {
  exitos: number;
  fallos: number;
  detalles: string[];

  constructor(exitos: number, fallos: number, detalles: string[] = []) {
    this.exitos = exitos;
    this.fallos = fallos;
    this.detalles = detalles;
  }
}
