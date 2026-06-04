import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlumnoService, Alumno } from '../../../../core/services/alumno.service';
import { GradoService, Grado } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './alumno-form.component.html',
  styleUrls: ['./alumno-form.component.css']
})
export class AlumnoFormComponent implements OnInit {
  alumnoForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  alumnoId: number | null = null;

  grados = signal<Grado[]>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alumnoService: AlumnoService,
    private gradoService: GradoService
  ) {
    this.alumnoForm = this.fb.group({
      matricula: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      curso: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
      gradoId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarSelectores();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.alumnoId = parseInt(id, 10);
      this.cargarAlumno();
    }
  }

  cargarSelectores(): void {
    this.gradoService.listar(1).subscribe(res => this.grados.set(res.data));
  }

  cargarAlumno(): void {
    if (!this.alumnoId) return;
    this.loading.set(true);
    this.alumnoService.obtenerPorId(this.alumnoId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (alumno) => {
          this.alumnoForm.patchValue({
            matricula: alumno.matricula,
            nombre: alumno.nombre,
            email: alumno.email,
            curso: alumno.curso,
            gradoId: alumno.gradoId
          });
        },
        error: (err) => {
          console.error('Error al cargar:', err);
          this.error.set('No se pudo cargar la información del alumno');
        }
      });
  }

  onSubmit(): void {
    if (this.alumnoForm.invalid) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    const values = {
      ...this.alumnoForm.value,
      gradoId: Number(this.alumnoForm.value.gradoId),
      curso: Number(this.alumnoForm.value.curso)
    };

    const operation = this.isEditMode() && this.alumnoId
      ? this.alumnoService.actualizar(this.alumnoId, values)
      : this.alumnoService.crear(values);

    operation.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (alumno) => {
          this.success.set(true);
          if (!this.isEditMode()) {
            setTimeout(() => {
              this.router.navigate(['/admin/alumnos/editar', alumno.id]);
            }, 1000);
          } else {
            setTimeout(() => this.success.set(false), 3000);
          }
        },
        error: (err) => {
          console.error('Error en operación:', err);
          this.error.set(err.error?.message || 'Ocurrió un error al procesar la solicitud');
        }
      });
  }
}
