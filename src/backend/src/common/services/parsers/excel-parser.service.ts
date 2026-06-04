import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { IFileParser } from '../../interfaces/file-parser.interface';

@Injectable()
export class ExcelParserService implements IFileParser {
  /**
   * Implementación para Excel con cabeceras.
   * Utiliza la primera fila del archivo como nombres de las propiedades del objeto.
   */
  parse<T>(buffer: Buffer): T[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    
    const rawData = XLSX.utils.sheet_to_json<T>(worksheet, { raw: false });

    return rawData.map(row => {
      const cleanRow: any = {};
      for (const key in row) {
        if (typeof row[key] === 'string') {
          cleanRow[key] = row[key].trim();
        } else {
          cleanRow[key] = row[key];
        }
      }
      return cleanRow as T;
    });
  }
}
