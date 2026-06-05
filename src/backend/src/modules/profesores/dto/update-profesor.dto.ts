import { PartialType } from '@nestjs/mapped-types';
import { CrearProfesorDto } from './crear-profesor.dto';

export class UpdateProfesorDto extends PartialType(CrearProfesorDto) {}
