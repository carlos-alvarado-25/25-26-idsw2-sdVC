import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';

export class CreateAulaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsInt()
  @Min(1)
  capacidad: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  edificio: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  planta: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;
}
