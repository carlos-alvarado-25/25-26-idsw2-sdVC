import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Profesor } from './profesor.entity';

@Entity('Preferencia')
export class Preferencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  diaSemana: number;

  @Column({ length: 5 })
  horaInicio: string;

  @Column({ length: 5 })
  horaFin: string; 

  @Column({ type: 'boolean', default: true })
  disponible: boolean;

  @Column()
  profesorId: number;

  @ManyToOne(() => Profesor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profesorId' })
  profesor: Profesor;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
