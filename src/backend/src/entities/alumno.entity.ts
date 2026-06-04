import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Grado } from './grado.entity';

@Entity('Alumno')
export class Alumno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  matricula: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 150 })
  email: string;

  @Column({ type: 'int' })
  curso: number;

  @ManyToOne(() => Grado, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gradoId' })
  grado: Grado;

  @Column()
  gradoId: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
