import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AsignaturaService, Asignatura } from '../../../../core/services/asignatura.service';
import { GradoService, Grado } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-asignatura-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './asignatura-form.component.html',
  styleUrls: ['./asignatura-form.component.css']
})
export class AsignaturaFormComponent implements OnInit {
  asignaturaForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  asignaturaId: number | null = null;

  grados = signal<Grado[]>([]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private asignaturaService: AsignaturaService,
    private gradoService: GradoService
  ) {
    this.asignaturaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      creditos: [6, [Validators.required, Validators.min(1)]],
      curso: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      cuatrimestre: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
      gradoId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarSelectores();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.asignaturaId = parseInt(id, 10);
      this.cargarAsignatura();
    }
  }

  cargarSelectores(): void {
    this.gradoService.listar(1).subscribe(res => this.grados.set(res.data));
  }

  cargarAsignatura(): void {
    if (!this.asignaturaId) return;
    this.loading.set(true);
    this.asignaturaService.obtenerPorId(this.asignaturaId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (asig) => {
          this.asignaturaForm.patchValue({
            codigo: asig.codigo,
            nombre: asig.nombre,
            creditos: asig.creditos,
            curso: asig.curso,
            cuatrimestre: asig.cuatrimestre,
            gradoId: asig.gradoId
          });
        },
        error: (err) => {
          console.error('Error al cargar:', err);
          this.error.set('No se pudo cargar la información de la asignatura');
        }
      });
  }

  onSubmit(): void {
    if (this.asignaturaForm.invalid) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    const values = {
      ...this.asignaturaForm.value,
      gradoId: Number(this.asignaturaForm.value.gradoId)
    };
    
    const operation = this.isEditMode() && this.asignaturaId
      ? this.asignaturaService.actualizar(this.asignaturaId, values)
      : this.asignaturaService.crear(values);

    operation.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (asig) => {
          this.success.set(true);
          if (!this.isEditMode()) {
            setTimeout(() => {
              this.router.navigate(['/admin/asignaturas/editar', asig.id]);
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
