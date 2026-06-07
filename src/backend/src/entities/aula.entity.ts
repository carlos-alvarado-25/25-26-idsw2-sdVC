import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Examen } from './examen.entity';

@Entity('Aula')
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ length: 100 })
  edificio: string;

  @Column({ length: 20 })
  planta: string;

  @Column({ length: 50 })
  tipo: string;

  tieneCapacidadSuficiente(cantidadAlumnos: number): boolean {
    return this.capacidad >= cantidadAlumnos;
  }

  estaDisponibleEn(fecha: string, franja: string, examenesAsignados: Examen[]): boolean {
    const [horaInicio] = franja.split('-');
    return !examenesAsignados.some(
      examen => (examen.aula?.id === this.id || examen.aulaId === this.id) && examen.fecha === fecha && examen.hora === horaInicio
    );
  }

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
