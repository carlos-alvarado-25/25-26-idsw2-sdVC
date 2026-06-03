import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AulaService, Aula } from '../../../../core/services/aula.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-aula-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './aula-form.component.html',
  styleUrls: ['./aula-form.component.css']
})
export class AulaFormComponent implements OnInit {
  aulaForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  aulaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private aulaService: AulaService
  ) {
    this.aulaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      capacidad: [30, [Validators.required, Validators.min(1)]],
      edificio: ['', [Validators.required, Validators.maxLength(100)]],
      planta: ['', [Validators.required, Validators.maxLength(20)]],
      tipo: ['Teoría', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.aulaId = parseInt(id, 10);
      this.cargarAula();
    }
  }

  cargarAula(): void {
    if (!this.aulaId) return;
    this.loading.set(true);
    this.aulaService.obtenerPorId(this.aulaId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (aula) => {
          this.aulaForm.patchValue(aula);
        },
        error: (err) => {
          console.error('Error al cargar:', err);
          this.error.set('No se pudo cargar la información del aula');
        }
      });
  }

  onSubmit(): void {
    if (this.aulaForm.invalid) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    const values = this.aulaForm.value;
    const operation = this.isEditMode() && this.aulaId
      ? this.aulaService.actualizar(this.aulaId, values)
      : this.aulaService.crear(values);

    operation.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (aula) => {
          this.success.set(true);
          if (!this.isEditMode()) {
            setTimeout(() => {
              this.router.navigate(['/admin/aulas/editar', aula.id]);
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
