export interface ExportOptions {
  incluirAula: boolean;
  incluirProfesor: boolean;
  incluirGrado: boolean;
}

export interface ExamenExportData {
  readonly codigo: string;
  readonly fecha: string;
  readonly hora: string;
  readonly duracion: number;
  readonly tipo: string;
  readonly nombreAsignatura: string;
  readonly nombreGrado: string;
  readonly nombreAula: string;
  readonly nombreProfesor: string;
}

export interface ExamenExporter {
  exportar(datos: readonly ExamenExportData[], opciones: ExportOptions): Promise<Buffer>;
}
