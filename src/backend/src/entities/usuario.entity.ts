import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'Admin',
  PROFESOR = 'Profesor',
  ALUMNO = 'Alumno',
}

@Entity('Usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  rol: UserRole;

  @CreateDateColumn()
  fechaCreacion: Date;
}
