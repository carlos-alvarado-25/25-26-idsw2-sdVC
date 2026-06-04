import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from '../../entities/alumno.entity';
import { Grado } from '../../entities/grado.entity';
import { AlumnoController } from './alumnos.controller';
import { AlumnoService } from './alumnos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Alumno, Grado])],
  controllers: [AlumnoController],
  providers: [AlumnoService],
  exports: [AlumnoService],
})
export class AlumnosModule {}
