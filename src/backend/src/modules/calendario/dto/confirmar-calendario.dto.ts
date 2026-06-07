import { IsArray, ValidateNested, IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AsignacionConfirmadaDto {
  @IsInt()
  examenId: number;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsInt()
  aulaId: number;

  @IsInt()
  @IsOptional()
  profesorId?: number | null;
}

export class ConfirmarCalendarioDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsignacionConfirmadaDto)
  asignaciones: AsignacionConfirmadaDto[];
}
