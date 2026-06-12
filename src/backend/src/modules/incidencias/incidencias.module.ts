import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidencia } from '../../entities/incidencia.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Examen } from '../../entities/examen.entity';
import { IncidenciasController } from './incidencias.controller';
import { IncidenciasService } from './incidencias.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incidencia, Profesor, Examen]),
  ],
  controllers: [IncidenciasController],
  providers: [IncidenciasService],
  exports: [IncidenciasService],
})
export class IncidenciasModule {}
