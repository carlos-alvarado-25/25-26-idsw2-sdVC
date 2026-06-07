import { IsString, IsNotEmpty, IsInt, IsEnum, MaxLength, Min, IsOptional } from 'class-validator';

export class CrearExamenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsOptional()
  fecha?: string | null; 

  @IsString()
  @IsOptional()
  @MaxLength(5)
  hora?: string | null;

  @IsInt()
  @Min(1)
  duracion: number;

  @IsEnum(['Ordinaria', 'Extraordinaria'])
  tipo: string;

  @IsInt()
  asignaturaId: number;
}
