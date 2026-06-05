import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsignaturaService, Asignatura } from '../../../../core/services/asignatura.service';
import { PagedResult } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-asignaturas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-asignaturas.component.html',
  styleUrls: ['./listar-asignaturas.component.css']
})
export class ListarAsignaturasComponent implements OnInit {
  asignaturas = signal<Asignatura[]>([]);
  total = signal(0);
  currentPage = signal(1);
  loading = signal(false);
  criterio = '';

  // Selección múltiple
  selectedIds = signal<Set<number>>(new Set());

  constructor(private asignaturaService: AsignaturaService) {}

  ngOnInit(): void {
    this.cargarAsignaturas();
  }

  cargarAsignaturas(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    this.selectedIds.set(new Set()); // Limpiar selección

    const request = this.criterio 
      ? this.asignaturaService.filtrar(this.criterio, page)
      : this.asignaturaService.listar(page);

    request.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: PagedResult<Asignatura>) => {
          this.asignaturas.set(res.data);
          this.total.set(res.total);
        },
        error: (err) => console.error('Error al cargar asignaturas:', err)
      });
  }

  // Lógica de selección
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      const ids = this.asignaturas().map(a => a.id);
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
    return this.asignaturas().length > 0 && this.selectedIds().size === this.asignaturas().length;
  }

  eliminarSeleccionados(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    if (confirm(`¿Está seguro de eliminar las ${ids.length} asignaturas seleccionadas?`)) {
      this.loading.set(true);
      this.asignaturaService.eliminarBulk(ids)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.selectedIds.set(new Set());
            this.cargarAsignaturas(this.currentPage());
          },
          error: (err) => alert('Error al eliminar las asignaturas seleccionadas')
        });
    }
  }

  onSearch(): void {
    this.cargarAsignaturas(1);
  }

  cambiarPagina(delta: number): void {
    const next = this.currentPage() + delta;
    if (next > 0) {
      this.cargarAsignaturas(next);
    }
  }

  eliminarAsignatura(asignatura: Asignatura): void {
    this.loading.set(true);
    this.asignaturaService.verificarImpacto(asignatura.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
        let mensaje = '¿Está seguro de eliminar la asignatura "' + asignatura.nombre + '"?';
        if (res.examenesAsociados > 0) {
          mensaje += '\n\nADVERTENCIA: Esta asignatura tiene ' + res.examenesAsociados + ' exámenes programados que también serán eliminados.';
        }

        if (confirm(mensaje)) {
          this.loading.set(true);
          this.asignaturaService.eliminar(asignatura.id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
              next: () => {
                this.cargarAsignaturas(this.currentPage());
              },
              error: (err) => alert(err.error?.message || 'Error al eliminar la asignatura')
            });
        }
      },
      error: (err) => {
        console.error('Error al verificar impacto:', err);
        alert('No se pudo verificar el impacto de la eliminación.');
      }
    });
  }
}
