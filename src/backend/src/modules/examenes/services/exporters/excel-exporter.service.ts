import { Injectable } from '@nestjs/common';
import { ExamenExporter, ExamenExportData, ExportOptions } from './examen-exporter.interface';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelExporterService implements ExamenExporter {
  async exportar(datos: readonly ExamenExportData[], opciones: ExportOptions): Promise<Buffer> {
    const data = datos.map(d => {
      const row: any = {
        'Código Examen': d.codigo,
        'Fecha': d.fecha,
        'Hora': d.hora,
        'Duración (min)': d.duracion,
        'Tipo': d.tipo,
        'Asignatura': d.nombreAsignatura,
      };

      if (opciones.incluirGrado) {
        row['Grado'] = d.nombreGrado;
      }
      if (opciones.incluirAula) {
        row['Aula'] = d.nombreAula;
      }
      if (opciones.incluirProfesor) {
        row['Profesor Supervisor'] = d.nombreProfesor;
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Calendario de Exámenes');

    // Auto-fit columns
    if (data.length > 0) {
      const maxLens = data.reduce((acc, row) => {
        Object.keys(row).forEach((key, colIdx) => {
          const valStr = String(row[key]);
          acc[colIdx] = Math.max(acc[colIdx] || 0, key.length, valStr.length);
        });
        return acc;
      }, [] as number[]);
      worksheet['!cols'] = maxLens.map((len: number) => ({ wch: len + 3 }));
    }

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }
}
