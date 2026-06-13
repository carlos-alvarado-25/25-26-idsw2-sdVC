import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { Grado } from './grado.entity';
import { Usuario } from './usuario.entity';

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

  @Column({ nullable: true })
  usuarioId: number | null;

  @OneToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario | null;

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
