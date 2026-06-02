import { PartialType } from '@nestjs/mapped-types';
import { CrearGradoDto } from './crear-grado.dto';

export class UpdateGradoDto extends PartialType(CrearGradoDto) {}
