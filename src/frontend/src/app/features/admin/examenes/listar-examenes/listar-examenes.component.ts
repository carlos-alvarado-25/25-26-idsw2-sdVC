import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamenService, Examen } from '../../../../core/services/examen.service';
import { PagedResult } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-examenes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-examenes.component.html',
  styleUrls: ['./listar-examenes.component.css']
})
export class ListarExamenesComponent implements OnInit {
  examenes = signal<Examen[]>([]);
  total = signal(0);
  currentPage = signal(1);
  loading = signal(false);
  criterio = '';

  constructor(private examenService: ExamenService) {}

  ngOnInit(): void {
    this.cargarExamenes();
  }

  cargarExamenes(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    const request = this.criterio 
      ? this.examenService.filtrar(this.criterio, page)
      : this.examenService.listar(page);

    request.pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: PagedResult<Examen>) => {
          this.examenes.set(res.data);
          this.total.set(res.total);
        },
        error: (err) => console.error('Error al cargar exámenes:', err)
      });
  }

  onSearch(): void {
    this.cargarExamenes(1);
  }

  cambiarPagina(delta: number): void {
    const next = this.currentPage() + delta;
    if (next > 0) {
      this.cargarExamenes(next);
    }
  }

  getAsignaturaTexto(examen: Examen): string {
    return examen.asignatura ? `${examen.asignatura.codigo} - ${examen.asignatura.nombre}` : 'Ninguna';
  }

  getAulaTexto(examen: Examen): string {
    return examen.aula ? `${examen.aula.codigo} (${examen.aula.nombre})` : 'Sin asignar';
  }

  getProfesorTexto(examen: Examen): string {
    return examen.profesor ? examen.profesor.nombre : 'Sin asignar';
  }

  eliminarExamen(examen: Examen): void {
    const asignatura = this.getAsignaturaTexto(examen);
    const fechaHora = `${examen.fecha} a las ${examen.hora} (${examen.duracion} min)`;
    const aula = this.getAulaTexto(examen);
    const profesor = this.getProfesorTexto(examen);

    const mensaje = `¿Está seguro de eliminar el examen "${examen.codigo}"?

Detalles del examen:
- Asignatura: ${asignatura}
- Horario: ${fechaHora}
- Aula: ${aula}
- Profesor Supervisor: ${profesor}

Esta acción no se puede deshacer.`;

    if (confirm(mensaje)) {
      this.loading.set(true);
      this.examenService.eliminar(examen.id)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.cargarExamenes(this.currentPage());
          },
          error: (err) => {
            console.error('Error al eliminar examen:', err);
            alert(err.error?.message || 'Error al eliminar el examen');
          }
        });
    }
  }
}
