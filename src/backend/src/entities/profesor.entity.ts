import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
