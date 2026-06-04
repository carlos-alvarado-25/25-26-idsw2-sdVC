import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlumnoService, Alumno } from '../../../../core/services/alumno.service';
import { PagedResult } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-alumnos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-alumnos.component.html',
  styleUrls: ['./listar-alumnos.component.css']
})
export class ListarAlumnosComponent implements OnInit {
  alumnos = signal<Alumno[]>([]);
  total = signal(0);
  currentPage = signal(1);
  loading = signal(false);
  criterio = '';

  selectedIds = signal<Set<number>>(new Set());

  constructor(private alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    this.selectedIds.set(new Set());

    const request = this.criterio 
      ? this.alumnoService.filtrar(this.criterio, page)
      : this.alumnoService.listar(page);

    request.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: PagedResult<Alumno>) => {
          this.alumnos.set(res.data);
          this.total.set(res.total);
        },
        error: (err) => console.error('Error al cargar alumnos:', err)
      });
  }

  onSearch(): void {
    this.cargarAlumnos(1);
  }

  cambiarPagina(delta: number): void {
    const next = this.currentPage() + delta;
    if (next > 0) {
      this.cargarAlumnos(next);
    }
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      const ids = this.alumnos().map(a => a.id);
      this.selectedIds.set(new Set(ids));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  toggleSelection(id: number): void {
    const next = new Set(this.selectedIds());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.selectedIds.set(next);
  }

  isAllSelected(): boolean {
    return this.alumnos().length > 0 && this.selectedIds().size === this.alumnos().length;
  }

  eliminarSeleccionados(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    if (confirm(`¿Está seguro de eliminar los ${ids.length} alumnos seleccionados?`)) {
      this.loading.set(true);
      this.alumnoService.eliminarBulk(ids)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.selectedIds.set(new Set());
            this.cargarAlumnos(this.currentPage());
          },
          error: (err) => alert('Error al eliminar los alumnos seleccionados')
        });
    }
  }

  eliminarAlumno(alumno: Alumno): void {
    if (confirm(`¿Está seguro de eliminar al alumno "${alumno.nombre}"?`)) {
      this.loading.set(true);
      this.alumnoService.eliminarBulk([alumno.id])
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => this.cargarAlumnos(this.currentPage()),
          error: (err) => alert(err.error?.message || 'Error al eliminar el alumno')
        });
    }
  }
}
