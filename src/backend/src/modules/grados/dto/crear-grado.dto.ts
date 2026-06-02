import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CrearGradoDto {
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(20, { message: 'El código no puede exceder los 20 caracteres' })
  codigo: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  nombre: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;
}
