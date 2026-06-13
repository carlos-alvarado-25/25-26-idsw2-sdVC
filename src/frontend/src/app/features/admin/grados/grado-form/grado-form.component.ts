import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GradoService, Grado } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-grado-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './grado-form.component.html',
  styleUrls: ['./grado-form.component.css']
})
export class GradoFormComponent implements OnInit {
  gradoForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  gradoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gradoService: GradoService
  ) {
    this.gradoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.gradoId = parseInt(id, 10);
      this.cargarGrado();

      if (this.route.snapshot.queryParamMap.get('creado') === 'true') {
        this.success.set(true);
        setTimeout(() => this.success.set(false), 3000);
      }
    }
  }

  cargarGrado(): void {
    if (!this.gradoId) return;
    this.loading.set(true);
    this.gradoService.obtenerPorId(this.gradoId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (grado) => this.gradoForm.patchValue(grado),
        error: (err) => {
          console.error('Error al cargar:', err);
          this.error.set('No se pudo cargar la información del grado');
        }
      });
  }

  onSubmit(): void {
    if (this.gradoForm.invalid) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    const operation = this.isEditMode() && this.gradoId
      ? this.gradoService.actualizar(this.gradoId, this.gradoForm.value)
      : this.gradoService.crear(this.gradoForm.value);

    operation.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (grado) => {
          this.success.set(true);
          if (!this.isEditMode()) {
            this.router.navigate(['/admin/grados/editar', grado.id], { queryParams: { creado: 'true' } });
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
