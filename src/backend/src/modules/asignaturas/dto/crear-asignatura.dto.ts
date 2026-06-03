import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

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
  @IsNotEmpty()
  gradoId: number;
}
