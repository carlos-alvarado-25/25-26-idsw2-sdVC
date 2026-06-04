import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { IFileParser } from '../../interfaces/file-parser.interface';

@Injectable()
export class CsvParserService implements IFileParser {
  /**
   * Implementación para CSV sin cabeceras.
   * Utiliza el array de headers proporcionado para mapear las columnas por posición.
   */
  parse<T>(buffer: Buffer, headers?: string[]): T[] {
    const workbook = XLSX.read(buffer, { 
      type: 'buffer',
      codepage: 65001
    });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    
    const rawData = XLSX.utils.sheet_to_json<T>(worksheet, { 
      header: headers,
      raw: false 
    });

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
