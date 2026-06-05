import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Expose } from 'class-transformer';
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
