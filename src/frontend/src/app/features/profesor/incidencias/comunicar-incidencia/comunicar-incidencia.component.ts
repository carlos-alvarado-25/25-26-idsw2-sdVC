import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExamenService, Examen } from '../../../../core/services/examen.service';
import { IncidenciaService, Incidencia } from '../../../../core/services/incidencia.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-comunicar-incidencia',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './comunicar-incidencia.component.html',
  styleUrls: ['./comunicar-incidencia.component.css']
})
export class ComunicarIncidenciaComponent implements OnInit {
  incidenciaForm: FormGroup;
  currentUser = signal<User | null>(null);
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  
  examenes = signal<Examen[]>([]);
  
  examenSeleccionado = signal<Examen | null>(null);
  
  examenFijo = signal(false);
  examenIdParam: number | null = null;

  incidencias = signal<Incidencia[]>([]);
  loadingIncidencias = signal(false);

  tiposIncidencia = [
    'Solapamiento de horarios',
    'Preferencia horaria',
    'Indisponibilidad',
    'Otros'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private examenService: ExamenService,
    private incidenciaService: IncidenciaService,
    private authService: AuthService
  ) {
    this.incidenciaForm = this.fb.group({
      examenId: [null, [Validators.required]],
      tipo: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser.set(user);
      
      if (user && user.rol === 'Profesor') {
        this.cargarIncidencias(user.email);
        const idParam = this.route.snapshot.paramMap.get('examenId');
        if (idParam) {
          this.examenIdParam = parseInt(idParam, 10);
          this.examenFijo.set(true);
          this.incidenciaForm.patchValue({ examenId: this.examenIdParam });
          this.incidenciaForm.get('examenId')?.disable(); // Bloquea la edición del dropdown
          this.cargarDetalleExamen(this.examenIdParam);
        } else {
          this.cargarExamenesProfesor(user.email);
        }
      } else {
        this.error.set('Acceso denegado: Se requiere rol de Profesor');
      }
    });

    this.incidenciaForm.get('examenId')?.valueChanges.subscribe((id) => {
      if (id && !this.examenFijo()) {
        const selected = this.examenes().find(ex => ex.id === parseInt(id, 10));
        this.examenSeleccionado.set(selected || null);
      }
    });
  }

  cargarDetalleExamen(id: number): void {
    this.loading.set(true);
    this.examenService.obtenerPorId(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (ex) => {
          this.examenSeleccionado.set(ex);
          this.examenes.set([ex]);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudo cargar la información del examen especificado');
        }
      });
  }

  cargarExamenesProfesor(email: string): void {
    this.loading.set(true);
    this.examenService.obtenerCalendario({ rol: 'Profesor', email })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (exs) => {
          this.examenes.set(exs);
          if (exs.length === 0) {
            this.error.set('No tienes exámenes asignados para reportar incidencias');
          }
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error al cargar la lista de exámenes asignados');
        }
      });
  }

  onSubmit(): void {
    if (this.incidenciaForm.invalid || !this.currentUser()) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    const email = this.currentUser()!.email;
    const rawVal = this.incidenciaForm.getRawValue(); // Obtiene todos los campos incluso si están desactivados
    
    const body = {
      examenId: parseInt(rawVal.examenId, 10),
      tipo: rawVal.tipo,
      descripcion: rawVal.descripcion
    };

    this.incidenciaService.crear(body, email)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.success.set(true);
          this.incidenciaForm.reset({
            examenId: this.examenFijo() ? this.examenIdParam : null,
            tipo: '',
            descripcion: ''
          });
          if (this.examenFijo()) {
            this.incidenciaForm.get('examenId')?.disable();
          } else {
            this.examenSeleccionado.set(null);
          }
          this.cargarIncidencias(email);
          setTimeout(() => {
            this.success.set(false);
          }, 3000);
        },
        error: (err) => {
          console.error(err);
          this.error.set(err.error?.message || 'Error al enviar el reporte de incidencia');
        }
      });
  }

  cargarIncidencias(email: string): void {
    this.loadingIncidencias.set(true);
    this.incidenciaService.listar(email, 'Profesor')
      .pipe(finalize(() => this.loadingIncidencias.set(false)))
      .subscribe({
        next: (data) => {
          this.incidencias.set(data);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
