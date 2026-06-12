import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateIncidenciaEstadoDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDIENTE', 'RESUELTA', 'RECHAZADA'])
  estado: string;
}
