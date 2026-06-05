import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamenService, Examen } from '../../../../core/services/examen.service';
import { ProfesorService, Profesor } from '../../../../core/services/profesor.service';
import { PagedResult } from '../../../../core/services/grado.service';
import { finalize, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-asignar-profesor-examen',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './asignar-profesor-examen.component.html',
  styleUrls: ['./asignar-profesor-examen.component.css']
})
export class AsignarProfesorExamenComponent implements OnInit {
  profesorId!: number;
  profesor = signal<Profesor | null>(null);

  examenes = signal<Examen[]>([]);
  totalExamenes = signal(0);
  paginaExamenes = signal(1);
  criterio = '';
  loadingExamenes = signal(false);

  examenSeleccionado = signal<Examen | null>(null);
  conflicto = signal<{ tieneConflicto: boolean; descripcion?: string } | null>(null);
  loadingConflicto = signal(false);

  loadingAsignacion = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  private busquedaSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examenService: ExamenService,
    private profesorService: ProfesorService,
  ) {}

  ngOnInit(): void {
    this.profesorId = parseInt(this.route.snapshot.paramMap.get('profesorId')!, 10);
    this.cargarProfesor();
    this.buscarExamenes();
  }

  cargarProfesor(): void {
    this.profesorService.obtenerPorId(this.profesorId).subscribe({
      next: (p) => this.profesor.set(p),
      error: () => this.error.set('No se pudo cargar el profesor.'),
    });
  }

  buscarExamenes(page: number = 1): void {
    this.loadingExamenes.set(true);
    this.paginaExamenes.set(page);
    this.examenSeleccionado.set(null);
    this.conflicto.set(null);

    this.examenService.buscarSinProfesor(this.criterio, page)
      .pipe(finalize(() => this.loadingExamenes.set(false)))
      .subscribe({
        next: (res: PagedResult<Examen>) => {
          this.examenes.set(res.data);
          this.totalExamenes.set(res.total);
        },
        error: () => this.error.set('Error al cargar los exámenes disponibles.'),
      });
  }

  onSearch(): void {
    this.buscarExamenes(1);
  }

  cambiarPagina(delta: number): void {
    const next = this.paginaExamenes() + delta;
    if (next > 0) this.buscarExamenes(next);
  }

  seleccionarExamen(examen: Examen): void {
    this.examenSeleccionado.set(examen);
    this.conflicto.set(null);
    this.success.set(false);
    this.error.set(null);
    this.loadingConflicto.set(true);

    this.examenService.verificarConflictoProfesor(examen.id, this.profesorId)
      .pipe(finalize(() => this.loadingConflicto.set(false)))
      .subscribe({
        next: (res) => this.conflicto.set(res),
        error: () => this.error.set('No se pudo verificar la disponibilidad del profesor.'),
      });
  }

  confirmarAsignacion(): void {
    const examen = this.examenSeleccionado();
    if (!examen || this.conflicto()?.tieneConflicto) return;

    this.loadingAsignacion.set(true);
    this.success.set(false);
    this.error.set(null);

    this.examenService.actualizar(examen.id, { profesorId: this.profesorId })
      .pipe(finalize(() => this.loadingAsignacion.set(false)))
      .subscribe({
        next: () => {
          this.success.set(true);
          setTimeout(() => {
            this.router.navigate(['/admin/profesores/editar', this.profesorId]);
          }, 1500);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error al realizar la asignación.');
        },
      });
  }

  volver(): void {
    this.router.navigate(['/admin/profesores/editar', this.profesorId]);
  }

  getAsignaturaTexto(examen: Examen): string {
    return `${examen.codigoAsignatura} - ${examen.nombreAsignatura}`;
  }
}
