import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Grado } from './grado.entity';

@Entity('Asignatura')
export class Asignatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'int' })
  creditos: number;

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
