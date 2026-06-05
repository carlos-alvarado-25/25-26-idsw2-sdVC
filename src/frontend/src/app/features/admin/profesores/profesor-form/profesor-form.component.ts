import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfesorService, Profesor } from '../../../../core/services/profesor.service';
import { AsignaturaService, Asignatura } from '../../../../core/services/asignatura.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profesor-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profesor-form.component.html',
  styleUrls: ['./profesor-form.component.css']
})
export class ProfesorFormComponent implements OnInit {
  profesorForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  profesorId: number | null = null;

  asignaturasSeleccionadas = signal<{ id: number; nombre: string; creditos?: number }[]>([]);
  asignaturasBusqueda = signal<Asignatura[]>([]);
  busquedaCriterio = '';
  busquedaLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profesorService: ProfesorService,
    private asignaturaService: AsignaturaService
  ) {
    this.profesorForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      departamento: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.profesorId = parseInt(id, 10);
      this.cargarProfesor();
      this.buscarAsignaturas();
    }
  }

  cargarProfesor(): void {
    if (!this.profesorId) return;
    this.loading.set(true);
    this.profesorService.obtenerPorId(this.profesorId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profesor) => {
          this.profesorForm.patchValue({
            codigo: profesor.codigo,
            nombre: profesor.nombre,
            email: profesor.email,
            departamento: profesor.departamento
          });
          this.asignaturasSeleccionadas.set(profesor.asignaturas || []);
        },
        error: (err) => {
          console.error('Error al cargar:', err);
          this.error.set('No se pudo cargar la información del profesor');
        }
      });
  }

  buscarAsignaturas(): void {
    this.busquedaLoading.set(true);
    const request = this.busquedaCriterio
      ? this.asignaturaService.filtrar(this.busquedaCriterio, 1)
      : this.asignaturaService.listar(1);

    request.pipe(finalize(() => this.busquedaLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.asignaturasBusqueda.set(res.data);
        },
        error: (err) => console.error('Error al buscar asignaturas:', err)
      });
  }

  asignarAsignatura(asignatura: Asignatura): void {
    if (this.isAsignada(asignatura.id)) return;
    this.asignaturasSeleccionadas.set([
      ...this.asignaturasSeleccionadas(),
      { id: asignatura.id, nombre: asignatura.nombre, creditos: asignatura.creditos }
    ]);
  }

  desasignarAsignatura(id: number): void {
    this.asignaturasSeleccionadas.set(
      this.asignaturasSeleccionadas().filter(a => a.id !== id)
    );
  }

  isAsignada(id: number): boolean {
    return this.asignaturasSeleccionadas().some(a => a.id === id);
  }

  onSubmit(): void {
    if (this.profesorForm.invalid) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    const values = {
      ...this.profesorForm.value,
      asignaturasIds: this.isEditMode() ? this.asignaturasSeleccionadas().map(a => a.id) : []
    };

    const operation = this.isEditMode() && this.profesorId
      ? this.profesorService.actualizar(this.profesorId, values)
      : this.profesorService.crear(values);

    operation.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profesor) => {
          this.success.set(true);
          if (!this.isEditMode()) {
            setTimeout(() => {
              this.router.navigate(['/admin/profesores/editar', profesor.id]);
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
