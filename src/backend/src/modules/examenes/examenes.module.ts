import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examen } from '../../entities/examen.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Alumno } from '../../entities/alumno.entity';
import { ExamenService } from './examenes.service';
import { ExamenController } from './examenes.controller';
import { ExcelExporterService } from './services/exporters/excel-exporter.service';
import { PdfExporterService } from './services/exporters/pdf-exporter.service';
import { ExamenExporterFactory } from './services/exporters/exporter.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Examen, Asignatura, Aula, Profesor, Alumno])],
  controllers: [ExamenController],
  providers: [
    ExamenService,
    ExcelExporterService,
    PdfExporterService,
    ExamenExporterFactory,
  ],
  exports: [ExamenService, ExamenExporterFactory],
})
export class ExamenesModule {}
