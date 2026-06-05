import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Asignatura } from './asignatura.entity';

@Entity('Profesor')
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 100 })
  departamento: string;

  @ManyToMany(() => Asignatura, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'ProfesorAsignatura',
    joinColumn: { name: 'idProfesor', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idAsignatura', referencedColumnName: 'id' },
  })
  asignaturas: Asignatura[];

  /**
   * Delegación: Provee una lista legible de las asignaturas impartidas
   */
  @Expose()
  get cargaLectivaTexto(): string {
    if (!this.asignaturas || this.asignaturas.length === 0) return 'Sin asignaturas';
    return this.asignaturas.map(a => a.nombre).join(', ');
  }

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
