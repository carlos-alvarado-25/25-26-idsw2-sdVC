import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Asignatura } from './asignatura.entity';
import { Aula } from './aula.entity';
import { Profesor } from './profesor.entity';

@Entity('Examen')
export class Examen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  codigo: string;

  @Column({ type: 'date', nullable: true })
  fecha: string | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  hora: string | null;

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

  @Expose()
  get nombreAsignatura(): string {
    return this.asignatura ? this.asignatura.nombre : 'Sin Asignatura';
  }

  @Expose()
  get codigoAsignatura(): string {
    return this.asignatura ? this.asignatura.codigo : '—';
  }

  @Expose()
  get nombreAula(): string {
    return this.aula ? this.aula.nombre : 'Sin Aula';
  }

  @Expose()
  get nombreProfesor(): string {
    return this.profesor ? this.profesor.nombre : 'Sin Asignar';
  }

  totalAlumnos: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
