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

  eliminarGrado(grado: Grado): void {
    this.gradoService.verificarImpacto(grado.id).subscribe({
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
