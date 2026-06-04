import { Global, Module } from '@nestjs/common';
import { CsvParserService } from './services/parsers/csv-parser.service';
import { ExcelParserService } from './services/parsers/excel-parser.service';
import { FileParserFactory } from './services/file-parser.factory';

@Global()
@Module({
  providers: [CsvParserService, ExcelParserService, FileParserFactory],
  exports: [FileParserFactory],
})
export class CommonModule {}
