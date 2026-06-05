import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from '../../entities/asignatura.entity';
import { Grado } from '../../entities/grado.entity';
import { Examen } from '../../entities/examen.entity';
import { AsignaturaController } from './asignaturas.controller';
import { AsignaturaService } from './asignaturas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asignatura, Grado, Examen])],
  controllers: [AsignaturaController],
  providers: [AsignaturaService],
  exports: [AsignaturaService],
})
export class AsignaturasModule {}
