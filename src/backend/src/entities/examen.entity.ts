import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Asignatura } from './asignatura.entity';
import { Aula } from './aula.entity';
import { Profesor } from './profesor.entity';

@Entity('Examen')
export class Examen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  codigo: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 5 })
  hora: string;

  @Column({ type: 'int' })
  duracion: number;

  @Column({ type: 'enum', enum: ['Ordinaria', 'Extraordinaria'] })
  tipo: string;

  @ManyToOne(() => Asignatura, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asignaturaId' })
  asignatura: Asignatura;

  @Column()
  asignaturaId: number;

  @ManyToOne(() => Aula, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'aulaId' })
  aula: Aula | null;

  @Column({ nullable: true })
  aulaId: number | null;

  @ManyToOne(() => Profesor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profesorId' })
  profesor: Profesor | null;

  @Column({ nullable: true })
  profesorId: number | null;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
