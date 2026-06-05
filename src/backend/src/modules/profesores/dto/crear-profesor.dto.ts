import { IsString, IsNotEmpty, IsEmail, MaxLength, IsArray, IsOptional, IsInt } from 'class-validator';

export class CrearProfesorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  departamento: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  asignaturasIds?: number[];
}
