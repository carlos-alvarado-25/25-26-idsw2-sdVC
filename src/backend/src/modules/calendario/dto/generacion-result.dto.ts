export interface ConflictInfo {
  examenId: number;
  examenCodigo: string;
  asignaturaNombre: string;
  motivo: string;
}

export interface AsignacionProposedDto {
  examenId: number;
  fecha: string;
  hora: string;
  aulaId: number;
  profesorId: number | null;
}

export class GeneracionResultDto {
  exito: boolean;
  totalExamenes: number;
  programados: number;
  noProgramados: number;
  conflictos: ConflictInfo[];
  propuesta?: AsignacionProposedDto[];
}
