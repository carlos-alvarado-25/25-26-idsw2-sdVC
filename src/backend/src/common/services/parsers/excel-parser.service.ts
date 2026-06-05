import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { IFileParser } from '../../interfaces/file-parser.interface';
import { BaseParser } from './base-parser';

@Injectable()
export class ExcelParserService extends BaseParser implements IFileParser {
  /**
   * Implementación para Excel con cabeceras.
   * Utiliza la primera fila del archivo como nombres de las propiedades del objeto.
   */
  parse<T>(buffer: Buffer, headers?: string[]): T[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    
    const rawData = XLSX.utils.sheet_to_json<any>(worksheet, { 
      header: headers,
      raw: false 
    });

    return this.cleanRows<T>(rawData);
  }
}
