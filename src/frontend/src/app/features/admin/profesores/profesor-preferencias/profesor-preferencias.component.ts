import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfesorService, Profesor } from '../../../../core/services/profesor.service';
import { ExamenService, ConflictoAlumno } from '../../../../core/services/examen.service';
import { PreferenciaService, Preferencia } from '../../../../core/services/preferencia.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profesor-preferencias',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profesor-preferencias.component.html',
  styleUrls: ['./profesor-preferencias.component.css']
})
export class ProfesorPreferenciasComponent implements OnInit {
  profesorId!: number;
  profesor = signal<Profesor | null>(null);
  conflictos = signal<ConflictoAlumno[]>([]);
  preferencias = signal<Preferencia[]>([]);

  preferenciaForm: FormGroup;
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  diasSemana = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profesorService: ProfesorService,
    private examenService: ExamenService,
    private preferenciaService: PreferenciaService
  ) {
    this.preferenciaForm = this.fb.group({
      diaSemana: [1, [Validators.required]],
      horaInicio: ['09:00', [Validators.required]],
      horaFin: ['11:00', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.profesorId = parseInt(idParam, 10);
      this.cargarTodo();
    } else {
      this.router.navigate(['/admin/profesores']);
    }
  }

  cargarTodo(): void {
    this.loading.set(true);
    this.error.set(null);

    // Cargar información del profesor
    this.profesorService.obtenerPorId(this.profesorId).subscribe({
      next: (prof) => {
        this.profesor.set(prof);
      },
      error: (err) => {
        console.error('Error al cargar profesor:', err);
        this.error.set('No se pudo cargar la información del profesor');
      }
    });

    // Cargar conflictos de alumnos
    this.examenService.obtenerConflictos(this.profesorId).subscribe({
      next: (conf) => {
        this.conflictos.set(conf);
      },
      error: (err) => {
        console.error('Error al cargar conflictos:', err);
      }
    });

    // Cargar preferencias del profesor
    this.preferenciaService.listar(this.profesorId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (prefs) => {
          this.preferencias.set(prefs);
        },
        error: (err) => {
          console.error('Error al cargar preferencias:', err);
          this.error.set('No se pudieron cargar las preferencias/restricciones');
        }
      });
  }

  getNombreDia(value: number): string {
    const dia = this.diasSemana.find(d => d.value === value);
    return dia ? dia.label : 'Desconocido';
  }

  agregarPreferencia(): void {
    if (this.preferenciaForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const values = this.preferenciaForm.value;
    const body: Partial<Preferencia> = {
      diaSemana: parseInt(values.diaSemana, 10),
      horaInicio: values.horaInicio,
      horaFin: values.horaFin,
      disponible: false // Siempre es exclusión horaria
    };

    this.preferenciaService.crear(this.profesorId, body)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (nuevaPref) => {
          this.preferencias.set([
            ...this.preferencias(),
            nuevaPref
          ].sort((a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio)));
          
          this.success.set(true);
          setTimeout(() => this.success.set(false), 3000);
          this.preferenciaForm.patchValue({
            diaSemana: 1,
            horaInicio: '09:00',
            horaFin: '11:00'
          });
        },
        error: (err) => {
          console.error('Error al crear preferencia:', err);
          this.error.set(err.error?.message || 'Ocurrió un error al agregar la exclusión horaria');
        }
      });
  }

  eliminarPreferencia(prefId: number): void {
    if (!confirm('¿Está seguro de que desea eliminar esta exclusión horaria?')) return;

    this.loading.set(true);
    this.error.set(null);

    this.preferenciaService.eliminar(prefId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.preferencias.set(this.preferencias().filter(p => p.id !== prefId));
        },
        error: (err) => {
          console.error('Error al eliminar preferencia:', err);
          this.error.set(err.error?.message || 'No se pudo eliminar la exclusión horaria');
        }
      });
  }
}
