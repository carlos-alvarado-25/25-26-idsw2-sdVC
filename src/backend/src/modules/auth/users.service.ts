import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from '../../entities/usuario.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async generateDefaultPasswordHash(): Promise<string> {
    return bcrypt.hash('idsw2_2026', 10);
  }

  async getOrCreateAssociatedUser(
    email: string,
    rol: UserRole,
    em?: EntityManager,
  ): Promise<Usuario> {
    const manager = em || this.usuarioRepository.manager;
    let usuario = await manager.findOneBy(Usuario, { email });
    if (!usuario) {
      const passwordHash = await this.generateDefaultPasswordHash();
      usuario = manager.create(Usuario, {
        email,
        password: passwordHash,
        rol,
      });
      usuario = await manager.save(Usuario, usuario);
    }
    return usuario;
  }

  async updateEmail(usuarioId: number, newEmail: string, em?: EntityManager): Promise<void> {
    const manager = em || this.usuarioRepository.manager;
    await manager.update(Usuario, usuarioId, { email: newEmail });
  }

  async deleteUsers(ids: number[], em?: EntityManager): Promise<void> {
    const manager = em || this.usuarioRepository.manager;
    await manager.delete(Usuario, ids);
  }
}
