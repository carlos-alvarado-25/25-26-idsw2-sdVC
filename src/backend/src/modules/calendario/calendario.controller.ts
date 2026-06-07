import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { CalendarioService } from './calendario.service';
import { GenerarCalendarioDto } from './dto/generar-calendario.dto';
import { GeneracionResultDto } from './dto/generacion-result.dto';
import { ConfirmarCalendarioDto } from './dto/confirmar-calendario.dto';

@Controller('calendario')
export class CalendarioController {
  constructor(private readonly calendarioService: CalendarioService) {}

  @Post('generar')
  @UsePipes(new ValidationPipe({ transform: true }))
  async generar(@Body() dto: GenerarCalendarioDto): Promise<GeneracionResultDto> {
    return this.calendarioService.generar(dto);
  }

  @Post('confirmar')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async confirmar(@Body() dto: ConfirmarCalendarioDto): Promise<void> {
    return this.calendarioService.confirmar(dto);
  }
}
