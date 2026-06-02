import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GradoService } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-crear-grado',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './crear-grado.component.html',
  styleUrls: ['./crear-grado.component.css']
})
export class CrearGradoComponent {
  gradoForm: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private gradoService: GradoService,
    private router: Router
  ) {
    this.gradoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['']
    });
  }

  onSubmit(): void {
    if (this.gradoForm.invalid) return;

    this.loading = true;
    this.error = null;
    this.success = false;

    this.gradoService.crear(this.gradoForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (grado) => {
          console.log('Grado creado:', grado);
          this.success = true;
          // Redirigir después de un breve delay para que vean el mensaje
          setTimeout(() => {
            this.router.navigate(['/admin/grados/editar', grado.id]);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al crear grado:', err);
          this.error = err.error?.message || 'Error al crear el grado';
        }
      });
  }
}
