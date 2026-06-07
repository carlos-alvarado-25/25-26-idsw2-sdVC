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
    const [slotStartStr, slotEndStr] = franja.split('-');
    const slotStart = this.convertTimeToMinutes(slotStartStr);
    const slotEnd = this.convertTimeToMinutes(slotEndStr);

    return !examenesAsignados.some(examen => {
      if ((examen.aula?.id !== this.id && examen.aulaId !== this.id) || examen.fecha !== fecha) {
        return false;
      }
      if (!examen.hora) return false;

      const exStart = this.convertTimeToMinutes(examen.hora);
      const exEnd = exStart + examen.duracion;

      return slotStart < exEnd && exStart < slotEnd;
    });
  }

  private convertTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
