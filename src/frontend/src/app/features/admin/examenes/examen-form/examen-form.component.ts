import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExamenService, Examen } from '../../../../core/services/examen.service';
import { AsignaturaService, Asignatura } from '../../../../core/services/asignatura.service';
import { AulaService, Aula } from '../../../../core/services/aula.service';
import { ProfesorService, Profesor } from '../../../../core/services/profesor.service';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-examen-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './examen-form.component.html',
  styleUrls: ['./examen-form.component.css']
})
export class ExamenFormComponent implements OnInit {
  examenForm: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  examenId: number | null = null;

  asignaturas = signal<Asignatura[]>([]);

  aulaSeleccionada = signal<any | null>(null);
  profesorSeleccionado = signal<any | null>(null);
  profesorAsignadoNombre = signal<string>('Sin asignar');

  aulasBusqueda = signal<Aula[]>([]);
  busquedaAulaCriterio = '';
  busquedaAulaLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private examenService: ExamenService,
    private asignaturaService: AsignaturaService,
    private aulaService: AulaService,
    private profesorService: ProfesorService
  ) {
    this.examenForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')]],
      duracion: [120, [Validators.required, Validators.min(1)]],
      tipo: ['Ordinaria', [Validators.required]],
      asignaturaId: ['', [Validators.required]],
      asignaturaSearch: ['', [Validators.required]],
      aulaId: [null],
      profesorId: [null]
    });
  }

  ngOnInit(): void {
    this.cargarSelectores();
    this.configurarBuscadorAsignaturas();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.examenId = parseInt(id, 10);
      this.buscarAulas();
      this.cargarExamen();
    }
  }

  cargarSelectores(): void {
    this.asignaturaService.listar(1).subscribe({
      next: (res) => this.asignaturas.set(res.data),
      error: (err) => console.error('Error al cargar asignaturas:', err)
    });
  }

  configurarBuscadorAsignaturas(): void {
    this.examenForm.get('asignaturaSearch')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(val => {
      const textVal = (val || '').trim();
      
      const matchInCurrent = this.asignaturas().find(asig => 
        `${asig.codigo} - ${asig.nombre}`.toLowerCase() === textVal.toLowerCase()
      );
      
      if (matchInCurrent) {
        this.examenForm.patchValue({ asignaturaId: matchInCurrent.id }, { emitEvent: false });
        return;
      }

      this.examenForm.patchValue({ asignaturaId: '' }, { emitEvent: false });

      if (textVal.length >= 2) {
        const queryVal = textVal.includes(' - ') ? textVal.split(' - ')[0].trim() : textVal;

        this.asignaturaService.filtrar(queryVal, 1).subscribe({
          next: (res) => {
            this.asignaturas.set(res.data);
            
            const match = res.data.find(asig => 
              `${asig.codigo} - ${asig.nombre}`.toLowerCase() === textVal.toLowerCase()
            );
            if (match) {
              this.examenForm.patchValue({ asignaturaId: match.id }, { emitEvent: false });
            }
          },
          error: (err) => console.error('Error al filtrar asignaturas:', err)
        });
      } else {
        if (!textVal) {
          this.cargarSelectores();
        }
      }
    });
  }

  buscarAulas(): void {
    this.busquedaAulaLoading.set(true);
    const request = this.busquedaAulaCriterio
      ? this.aulaService.filtrar(this.busquedaAulaCriterio)
      : this.aulaService.listar();

    request.pipe(finalize(() => this.busquedaAulaLoading.set(false)))
      .subscribe({
        next: (res) => this.aulasBusqueda.set(res),
        error: (err) => console.error('Error al buscar aulas:', err)
      });
  }

  asignarAula(aula: Aula): void {
    this.aulaSeleccionada.set(aula);
    this.examenForm.patchValue({ aulaId: aula.id });
  }

  desasignarAula(): void {
    this.aulaSeleccionada.set(null);
    this.examenForm.patchValue({ aulaId: null });
  }

  isAulaAsignada(id: number): boolean {
    return this.aulaSeleccionada()?.id === id;
  }

  desasignarProfesor(): void {
    if (!this.examenId) return;
    this.loading.set(true);
    this.error.set(null);
    this.examenService.actualizar(this.examenId, { profesorId: null })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.profesorSeleccionado.set(null);
          this.profesorAsignadoNombre.set('Sin asignar');
          this.examenForm.patchValue({ profesorId: null }, { emitEvent: false });
          this.success.set(true);
          setTimeout(() => this.success.set(false), 3000);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al desasignar el profesor.');
        },
      });
  }

  cargarExamen(): void {
    if (!this.examenId) return;
    this.loading.set(true);
    this.examenService.obtenerPorId(this.examenId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (examen) => {
          if (examen.asignatura) {
            const currentList = this.asignaturas();
            if (!currentList.some(a => a.id === examen.asignatura?.id)) {
              this.asignaturas.set([examen.asignatura as any, ...currentList]);
            }
          }

          this.aulaSeleccionada.set(examen.aula || null);
          this.profesorSeleccionado.set(examen.profesor || null);
          this.profesorAsignadoNombre.set(examen.nombreProfesor);

          const asigText = `${examen.codigoAsignatura} - ${examen.nombreAsignatura}`;

          this.examenForm.patchValue({
            codigo: examen.codigo,
            fecha: examen.fecha,
            hora: examen.hora,
            duracion: examen.duracion,
            tipo: examen.tipo,
            asignaturaId: examen.asignaturaId,
            asignaturaSearch: asigText,
            aulaId: examen.aulaId,
            profesorId: examen.profesorId
          }, { emitEvent: false });
        },
        error: (err) => {
          console.error('Error al cargar examen:', err);
          this.error.set('No se pudo cargar la información del examen');
        }
      });
  }

  onSubmit(): void {
    if (this.examenForm.invalid) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(null);

    const values: any = {
      codigo: this.examenForm.value.codigo,
      fecha: this.examenForm.value.fecha,
      hora: this.examenForm.value.hora,
      duracion: Number(this.examenForm.value.duracion),
      tipo: this.examenForm.value.tipo,
      asignaturaId: Number(this.examenForm.value.asignaturaId)
    };

    if (this.isEditMode()) {
      values.aulaId = this.examenForm.value.aulaId ? Number(this.examenForm.value.aulaId) : null;
      values.profesorId = this.examenForm.value.profesorId ? Number(this.examenForm.value.profesorId) : null;
    }

    const operation = this.isEditMode() && this.examenId
      ? this.examenService.actualizar(this.examenId, values)
      : this.examenService.crear(values);

    operation.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (examen) => {
          this.success.set(true);
          if (!this.isEditMode()) {
            setTimeout(() => {
              this.router.navigate(['/admin/examenes/editar', examen.id]);
            }, 1000);
          } else {
            setTimeout(() => this.success.set(false), 3000);
          }
        },
        error: (err) => {
          console.error('Error en operación:', err);
          this.error.set(err.error?.message || 'Ocurrió un error al procesar el examen');
        }
      });
  }
}
