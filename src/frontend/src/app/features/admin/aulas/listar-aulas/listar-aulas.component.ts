import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AulaService, Aula } from '../../../../core/services/aula.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-aulas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-aulas.component.html',
  styleUrls: ['./listar-aulas.component.css']
})
export class ListarAulasComponent implements OnInit {
  aulas = signal<Aula[]>([]);
  loading = signal(false);
  criterio = '';

  // Selección múltiple
  selectedIds = signal<Set<number>>(new Set());

  constructor(private aulaService: AulaService) {}

  ngOnInit(): void {
    this.cargarAulas();
  }

  cargarAulas(): void {
    this.loading.set(true);
    this.selectedIds.set(new Set()); // Limpiar selección

    const request = this.criterio 
      ? this.aulaService.filtrar(this.criterio)
      : this.aulaService.listar();

    request.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => this.aulas.set(res),
        error: (err) => console.error('Error al cargar aulas:', err)
      });
  }

  // Lógica de selección
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      const ids = this.aulas().map(a => a.id);
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
    return this.aulas().length > 0 && this.selectedIds().size === this.aulas().length;
  }

  eliminarSeleccionados(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    if (confirm(`¿Está seguro de eliminar las ${ids.length} aulas seleccionadas?`)) {
      this.loading.set(true);
      this.aulaService.eliminarBulk(ids)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.selectedIds.set(new Set());
            this.cargarAulas();
          },
          error: (err) => alert('Error al eliminar las aulas seleccionadas')
        });
    }
  }

  onSearch(): void {
    this.cargarAulas();
  }

  eliminarAula(aula: Aula): void {
    this.loading.set(true);
    this.aulaService.verificarImpacto(aula.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
        let mensaje = `¿Está seguro de eliminar el aula "${aula.nombre}"?`;
        if (res.examenesAsociados > 0) {
          mensaje += `\n\nADVERTENCIA: Esta aula tiene ${res.examenesAsociados} exámenes programados que quedarán sin espacio asignado.`;
        }

        if (confirm(mensaje)) {
          this.loading.set(true);
          this.aulaService.eliminar(aula.id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
              next: () => this.cargarAulas(),
              error: (err) => alert(err.error?.message || 'Error al eliminar el aula')
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
