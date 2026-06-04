import { Injectable, BadRequestException } from '@nestjs/common';
import { CsvParserService } from './parsers/csv-parser.service';
import { ExcelParserService } from './parsers/excel-parser.service';
import { IFileParser } from '../interfaces/file-parser.interface';

@Injectable()
export class FileParserFactory {
  constructor(
    private readonly csvParser: CsvParserService,
    private readonly excelParser: ExcelParserService,
  ) {}

  /**
   * Retorna el parser adecuado según el mimetype del archivo.
   */
  getParser(mimetype: string): IFileParser {
    if (mimetype === 'text/csv') {
      return this.csvParser;
    }
    
    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      mimetype === 'application/vnd.ms-excel'
    ) {
      return this.excelParser;
    }

    throw new BadRequestException('Formato de archivo no soportado. Use CSV o Excel.');
  }
}
