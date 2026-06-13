import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfesorService, Profesor } from '../../../../core/services/profesor.service';
import { PagedResult } from '../../../../core/services/grado.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-listar-profesores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-profesores.component.html',
  styleUrls: ['./listar-profesores.component.css']
})
export class ListarProfesoresComponent implements OnInit {
  profesores = signal<Profesor[]>([]);
  total = signal(0);
  currentPage = signal(1);
  loading = signal(false);
  criterio = '';

  selectedIds = signal<Set<number>>(new Set());

  constructor(private profesorService: ProfesorService) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  cargarProfesores(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    this.selectedIds.set(new Set());

    const request = this.criterio 
      ? this.profesorService.filtrar(this.criterio, page)
      : this.profesorService.listar(page);

    request.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: PagedResult<Profesor>) => {
          this.profesores.set(res.data);
          this.total.set(res.total);
        },
        error: (err) => console.error('Error al cargar profesores:', err)
      });
  }

  onSearch(): void {
    this.cargarProfesores(1);
  }

  cambiarPagina(delta: number): void {
    const next = this.currentPage() + delta;
    if (next > 0) {
      this.cargarProfesores(next);
    }
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      const ids = this.profesores().map(p => p.id);
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
    return this.profesores().length > 0 && this.selectedIds().size === this.profesores().length;
  }

  eliminarSeleccionados(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    this.loading.set(true);
    forkJoin(ids.map(id => this.profesorService.obtenerImpacto(id)))
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resultados) => {
          const totalExamenes = resultados.reduce((acc, r) => acc + r.examenesCount, 0);
          let mensaje = `¿Está seguro de eliminar los ${ids.length} profesores seleccionados?`;
          if (totalExamenes > 0) {
            mensaje += `\n\n¡ATENCIÓN! Los profesores seleccionados tienen en total ${totalExamenes} exámen(es) programado(s) asociados que quedarán desvinculados.`;
          }
          if (confirm(mensaje)) {
            this.loading.set(true);
            this.profesorService.eliminarBulk(ids)
              .pipe(finalize(() => this.loading.set(false)))
              .subscribe({
                next: () => {
                  this.selectedIds.set(new Set());
                  this.cargarProfesores(this.currentPage());
                },
                error: () => alert('Error al eliminar los profesores seleccionados')
              });
          }
        },
        error: () => {
          alert('No se pudo verificar el impacto de la eliminación. Inténtelo de nuevo.');
        }
      });
  }

  eliminarProfesor(profesor: Profesor): void {
    this.loading.set(true);
    this.profesorService.obtenerImpacto(profesor.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const count = res.examenesCount;
          let mensaje = `¿Está seguro de eliminar al profesor "${profesor.nombre}"?`;
          if (count > 0) {
            mensaje = `¡ATENCIÓN! El profesor "${profesor.nombre}" tiene ${count} exámenes programados asociados.\n¿Está seguro de eliminarlo y desvincular dichos exámenes?`;
          } else {
            mensaje = `Este profesor no tiene exámenes asociados.\n¿Está seguro de eliminar al profesor "${profesor.nombre}"?`;
          }

          if (confirm(mensaje)) {
            this.loading.set(true);
            this.profesorService.eliminarBulk([profesor.id])
              .pipe(finalize(() => this.loading.set(false)))
              .subscribe({
                next: () => this.cargarProfesores(this.currentPage()),
                error: (err) => alert(err.error?.message || 'Error al eliminar el profesor')
              });
          }
        },
        error: (err) => {
          console.error('Error al verificar impacto:', err);
          alert('No se pudo verificar el impacto de la eliminación. Inténtelo de nuevo.');
        }
      });
  }

  getAsignaturasNombres(profesor: Profesor): string {
    return profesor.cargaLectivaTexto;
  }
}
