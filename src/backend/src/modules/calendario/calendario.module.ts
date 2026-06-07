import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examen } from '../../entities/examen.entity';
import { Aula } from '../../entities/aula.entity';
import { Profesor } from '../../entities/profesor.entity';
import { Preferencia } from '../../entities/preferencia.entity';
import { CalendarioService } from './calendario.service';
import { CalendarioController } from './calendario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Examen, Aula, Profesor, Preferencia]),
  ],
  controllers: [CalendarioController],
  providers: [CalendarioService],
  exports: [CalendarioService],
})
export class CalendarioModule {}
