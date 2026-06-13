import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CrearAsignaturaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @Min(1)
  creditos: number;

  @IsInt()
  @Min(1)
  curso: number;

  @IsInt()
  @Min(1)
  @Max(2)
  cuatrimestre: number;

  @IsInt()
  @IsNotEmpty()
  gradoId: number;
}
