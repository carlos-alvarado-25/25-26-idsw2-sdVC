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

  constructor(private gradoService: GradoService) {}

  ngOnInit(): void {
    this.cargarGrados();
  }

  cargarGrados(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

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

  onSearch(): void {
    this.cargarGrados(1);
  }

  cambiarPagina(delta: number): void {
    const next = this.currentPage() + delta;
    if (next > 0) {
      this.cargarGrados(next);
    }
  }
}
