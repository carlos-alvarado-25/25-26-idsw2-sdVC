import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from '../../entities/aula.entity';
import { AulaController } from './aulas.controller';
import { AulaService } from './aulas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aula])],
  controllers: [AulaController],
  providers: [AulaService],
  exports: [AulaService],
})
export class AulasModule {}
