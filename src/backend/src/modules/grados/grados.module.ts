import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grado } from '../../entities/grado.entity';
import { Asignatura } from '../../entities/asignatura.entity';
import { GradoService } from './grados.service';
import { GradoController } from './grados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Grado, Asignatura])],
  controllers: [GradoController],
  providers: [GradoService],
  exports: [GradoService],
})
export class GradoModule {}
