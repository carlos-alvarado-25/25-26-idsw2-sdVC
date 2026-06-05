import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorController } from './profesores.controller';
import { ProfesorService } from './profesores.service';
import { Profesor } from '../../entities/profesor.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profesor, Asignatura]),
    CommonModule,
  ],
  controllers: [ProfesorController],
  providers: [ProfesorService],
  exports: [ProfesorService],
})
export class ProfesoresModule {}
