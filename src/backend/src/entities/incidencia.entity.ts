import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Examen } from './examen.entity';
import { Profesor } from './profesor.entity';

@Entity('Incidencia')
export class Incidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  tipo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'RESUELTA', 'RECHAZADA'],
    default: 'PENDIENTE',
  })
  estado: string;

  @Column()
  examenId: number;

  @Column()
  profesorId: number;

  @ManyToOne(() => Examen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examenId' })
  examen: Examen;

  @ManyToOne(() => Profesor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profesorId' })
  profesor: Profesor;

  @Expose()
  get codigoExamen(): string {
    return this.examen ? this.examen.codigo : '';
  }

  @Expose()
  get nombreAsignatura(): string {
    return this.examen ? this.examen.nombreAsignatura : '';
  }

  @Expose()
  get nombreProfesor(): string {
    return this.profesor ? this.profesor.nombre : '';
  }

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
