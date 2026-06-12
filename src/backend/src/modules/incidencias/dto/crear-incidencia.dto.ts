import { IsInt, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';

export class CrearIncidenciaDto {
  @IsInt()
  @IsNotEmpty()
  examenId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Solapamiento de horarios', 'Preferencia horaria', 'Indisponibilidad', 'Otros'])
  tipo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  descripcion: string;
}
