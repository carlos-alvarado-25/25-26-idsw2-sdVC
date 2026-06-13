import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IncidenciaService, Incidencia } from '../../../../core/services/incidencia.service';
import { AuthService, User } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listar-incidencias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-incidencias.component.html',
  styleUrls: ['./listar-incidencias.component.css']
})
export class ListarIncidenciasComponent implements OnInit {
  incidencias = signal<Incidencia[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  currentUser = signal<User | null>(null);

  constructor(
    private incidenciaService: IncidenciaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser.set(user);
      if (user && user.rol === 'Admin') {
        this.cargarIncidencias();
      } else {
        this.error.set('Acceso denegado: Se requiere rol de Administrador');
      }
    });
  }

  cargarIncidencias(): void {
    this.loading.set(true);
    this.error.set(null);
    this.incidenciaService.listar(undefined, 'Admin')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.incidencias.set(data);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudieron cargar las incidencias del sistema');
        }
      });
  }

  cambiarEstado(id: number, nuevoEstado: 'PENDIENTE' | 'RESUELTA' | 'RECHAZADA'): void {
    this.loading.set(true);
    this.success.set(null);
    this.error.set(null);

    this.incidenciaService.actualizarEstado(id, nuevoEstado)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (actualizada) => {
          this.success.set(`Incidencia #${id} actualizada a estado: ${nuevoEstado}`);
          this.incidencias.update((list) => 
            list.map((inc) => inc.id === id ? { ...inc, estado: actualizada.estado } : inc)
          );
          setTimeout(() => this.success.set(null), 3000);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudo actualizar el estado de la incidencia');
        }
      });
  }
}
