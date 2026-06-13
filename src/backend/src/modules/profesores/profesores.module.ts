import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorController } from './profesores.controller';
import { PreferenciaController } from './preferencia.controller';
import { ProfesorService } from './profesores.service';
import { Profesor } from '../../entities/profesor.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { Examen } from '../../entities/examen.entity';
import { Preferencia } from '../../entities/preferencia.entity';
import { Usuario } from '../../entities/usuario.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profesor, Asignatura, Examen, Preferencia, Usuario]),
    CommonModule,
  ],
  controllers: [ProfesorController, PreferenciaController],
  providers: [ProfesorService],
  exports: [ProfesorService],
})
export class ProfesoresModule {}

