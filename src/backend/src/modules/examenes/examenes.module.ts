import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examen } from '../../entities/examen.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Alumno } from '../../entities/alumno.entity';
import { ExamenService } from './examenes.service';
import { ExamenController } from './examenes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Examen, Asignatura, Aula, Profesor, Alumno])],
  controllers: [ExamenController],
  providers: [ExamenService],
  exports: [ExamenService],
})
export class ExamenesModule {}
