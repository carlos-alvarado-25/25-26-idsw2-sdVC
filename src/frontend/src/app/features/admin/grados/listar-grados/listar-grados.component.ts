import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GradoService, Grado, PagedResult } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-grados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-grados.component.html',
  styleUrls: ['./listar-grados.component.css']
})
export class ListarGradosComponent implements OnInit {
  grados = signal<Grado[]>([]);
  total = signal(0);
  currentPage = signal(1);
  loading = signal(false);
  criterio = '';

  // Selección múltiple
  selectedIds = signal<Set<number>>(new Set());

  constructor(private gradoService: GradoService) {}

  ngOnInit(): void {
    this.cargarGrados();
  }

  cargarGrados(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    this.selectedIds.set(new Set()); // Limpiar selección al cambiar página

    const request = this.criterio 
      ? this.gradoService.filtrar(this.criterio, page)
      : this.gradoService.listar(page);

    request.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: PagedResult<Grado>) => {
          this.grados.set(res.data);
          this.total.set(res.total);
        },
        error: (err) => console.error('Error al cargar grados:', err)
      });
  }

  // Lógica de selección
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      const ids = this.grados().map(g => g.id);
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
    return this.grados().length > 0 && this.selectedIds().size === this.grados().length;
  }

  eliminarSeleccionados(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    if (confirm(`¿Está seguro de eliminar los ${ids.length} grados seleccionados?`)) {
      this.loading.set(true);
      this.gradoService.eliminarBulk(ids)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.selectedIds.set(new Set());
            this.cargarGrados(this.currentPage());
          },
          error: (err) => alert('Error al eliminar los grados seleccionados')
        });
    }
  }

  onSearch(): void {
    this.cargarGrados(1);
  }

  cambiarPagina(delta: number): void {
    const next = this.currentPage() + delta;
    if (next > 0) {
      this.cargarGrados(next);
    }
  }

  eliminarGrado(grado: Grado): void {
    this.loading.set(true);
    this.gradoService.verificarImpacto(grado.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (totalAsignaturas) => {
        let mensaje = '¿Está seguro de eliminar el grado "' + grado.nombre + '"?';
        if (totalAsignaturas > 0) {
          mensaje += '\n\nADVERTENCIA: Este grado tiene ' + totalAsignaturas + ' asignaturas vinculadas que también podrían verse afectadas.';
        }

        if (confirm(mensaje)) {
          this.loading.set(true);
          this.gradoService.eliminar(grado.id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
              next: () => {
                console.log('Grado eliminado');
                this.cargarGrados(this.currentPage());
              },
              error: (err) => alert(err.error?.message || 'Error al eliminar el grado')
            });
        }
      },
      error: (err) => {
        console.error('Error al verificar impacto:', err);
        alert('No se pudo verificar el impacto de la eliminación. Por favor, intente de nuevo.');
      }
    });
  }
}
