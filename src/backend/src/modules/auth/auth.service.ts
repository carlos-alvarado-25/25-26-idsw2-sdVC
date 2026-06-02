import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email })
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async logout() {
    return { message: 'Sesión cerrada correctamente' };
  }
}
