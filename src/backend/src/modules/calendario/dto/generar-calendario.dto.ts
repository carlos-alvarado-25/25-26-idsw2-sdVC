import { IsDateString, IsArray, IsString } from 'class-validator';

export class GenerarCalendarioDto {
  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsArray()
  @IsString({ each: true })
  franjasHorarias: string[];
}
