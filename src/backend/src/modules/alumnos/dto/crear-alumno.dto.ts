import { IsString, IsNotEmpty, IsEmail, IsInt, Min, Max, MaxLength } from 'class-validator';

export class CrearAlumnoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  matricula: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsInt()
  @Min(1)
  @Max(6)
  curso: number;

  @IsInt()
  @IsNotEmpty()
  gradoId: number;
}
