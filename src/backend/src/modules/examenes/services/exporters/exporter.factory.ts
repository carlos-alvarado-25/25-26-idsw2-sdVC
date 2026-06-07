import { Injectable, BadRequestException } from '@nestjs/common';
import { ExamenExporter } from './examen-exporter.interface';
import { ExcelExporterService } from './excel-exporter.service';
import { PdfExporterService } from './pdf-exporter.service';

@Injectable()
export class ExamenExporterFactory {
  constructor(
    private readonly excelExporter: ExcelExporterService,
    private readonly pdfExporter: PdfExporterService,
  ) {}

  getExporter(formato: string): ExamenExporter {
    switch (formato?.toLowerCase()) {
      case 'excel':
      case 'xlsx':
        return this.excelExporter;
      case 'pdf':
        return this.pdfExporter;
      default:
        throw new BadRequestException(`Formato de exportación "${formato}" no soportado.`);
    }
  }
}
