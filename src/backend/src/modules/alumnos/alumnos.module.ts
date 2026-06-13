import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from '../../entities/alumno.entity';
import { Grado } from '../../entities/grado.entity';
import { Usuario } from '../../entities/usuario.entity';
import { AlumnoController } from './alumnos.controller';
import { AlumnoService } from './alumnos.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alumno, Grado, Usuario]),
    AuthModule,
  ],
  controllers: [AlumnoController],
  providers: [AlumnoService],
  exports: [AlumnoService],
})
export class AlumnosModule {}
