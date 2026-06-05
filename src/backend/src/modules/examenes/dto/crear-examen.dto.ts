import { IsString, IsNotEmpty, IsInt, IsEnum, MaxLength, Min } from 'class-validator';

export class CrearExamenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  fecha: string; 

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  hora: string;

  @IsInt()
  @Min(1)
  duracion: number;

  @IsEnum(['Ordinaria', 'Extraordinaria'])
  tipo: string;

  @IsInt()
  asignaturaId: number;
}
