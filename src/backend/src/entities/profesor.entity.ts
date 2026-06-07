import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Asignatura } from './asignatura.entity';
import { Preferencia } from './preferencia.entity';
import { Examen } from './examen.entity';

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

  @Expose()
  get cargaLectivaTexto(): string {
    if (!this.asignaturas || this.asignaturas.length === 0) return 'Sin asignaturas';
    return this.asignaturas.map(a => a.nombre).join(', ');
  }

  @OneToMany(() => Preferencia, (preferencia) => preferencia.profesor)
  preferencias: Preferencia[];

  estaDisponibleEn(fecha: string, franja: string, preferencias: Preferencia[]): boolean {
    const diaSemana = Preferencia.getDiaSemanaDeFecha(fecha);
    const [horaInicio, horaFin] = franja.split('-');

    const tieneExclusion = (preferencias || []).some(pref => {
      if (pref.diaSemana !== diaSemana) return false;
      if (pref.disponible === true) return false;

      return horaInicio < pref.horaFin && pref.horaInicio < horaFin;
    });

    return !tieneExclusion;
  }

  tieneCruceHorario(fecha: string, franja: string, examenesAsignados: Examen[]): boolean {
    const [horaInicio] = franja.split('-');
    return (examenesAsignados || []).some(
      examen => (examen.profesor?.id === this.id || examen.profesorId === this.id) && examen.fecha === fecha && examen.hora === horaInicio
    );
  }

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
