import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Expose } from 'class-transformer';
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

  @Column({ type: 'int', default: 1 })
  curso: number;

  @Column({ type: 'int', default: 1 })
  cuatrimestre: number;

  @ManyToOne(() => Grado, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gradoId' })
  grado: Grado;

  @Column()
  gradoId: number;

  /**
   * Delegación: Provee el nombre del grado sin navegar por la asociación
   */
  @Expose()
  get nombreGrado(): string {
    return this.grado ? this.grado.nombre : 'Sin Grado';
  }

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
