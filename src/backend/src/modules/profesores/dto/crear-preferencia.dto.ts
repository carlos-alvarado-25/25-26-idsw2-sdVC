import { IsInt, IsString, IsBoolean, IsNotEmpty, Matches, Min, Max } from 'class-validator';

export class CrearPreferenciaDto {
  @IsInt()
  @Min(1)
  @Max(5)
  diaSemana: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'horaInicio debe estar en formato HH:MM' })
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'horaFin debe estar en formato HH:MM' })
  horaFin: string;

  @IsBoolean()
  disponible: boolean;
}
