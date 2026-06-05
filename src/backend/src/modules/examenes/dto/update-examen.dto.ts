import { PartialType } from '@nestjs/mapped-types';
import { CrearExamenDto } from './crear-examen.dto';
import { IsOptional, IsInt, IsNumber } from 'class-validator';

export class UpdateExamenDto extends PartialType(CrearExamenDto) {
  @IsOptional()
  @IsInt()
  aulaId?: number | null;

  @IsOptional()
  @IsInt()
  profesorId?: number | null;
}
