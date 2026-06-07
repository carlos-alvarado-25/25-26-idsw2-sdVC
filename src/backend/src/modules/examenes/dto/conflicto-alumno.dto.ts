export class ConflictoAlumnoDto {
  examenId: number;
  examenCodigo: string;
  asignaturaNombre: string;
  gradoNombre: string;
  fecha: string;
  hora: string;
  duracion: number;
  solapaConExamenId: number;
  solapaConExamenCodigo: string;
  solapaConAsignaturaNombre: string;
  motivoConflicto: string;
  tipoConflicto: string; // 'Alumnos' | 'Aula' | 'Profesor'
}
