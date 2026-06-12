import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrapper">
      <nav class="top-nav">
        <div class="logo">📅 IdSw 2</div>
        <div class="user-info" *ngIf="user$ | async as user">
          <span>{{ user.email }} (<strong>{{ user.rol }}</strong>)</span>
          <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>

      <main class="content">
        <header class="hero">
          <h1>Panel de Gestión Académica</h1>
          <p>Seleccione una entidad para gestionar los recursos del sistema.</p>
        </header>

        <div class="grid-container" *ngIf="user$ | async as user">
          <!-- Tarjetas de Administración (Solo Admin) -->
          <ng-container *ngIf="user.rol === 'Admin'">
            <!-- Gestión de Grados -->
            <div class="card" [routerLink]="['/admin/grados']">
              <div class="card-icon">🎓</div>
              <h3>Grados</h3>
              <p>Mantenimiento de titulaciones y facultades.</p>
            </div>

            <!-- Gestión de Asignaturas -->
            <div class="card" [routerLink]="['/admin/asignaturas']">
              <div class="card-icon">📚</div>
              <h3>Asignaturas</h3>
              <p>Administración de materias y créditos.</p>
            </div>

            <!-- Gestión de Profesores -->
            <div class="card" [routerLink]="['/admin/profesores']">
              <div class="card-icon">👨‍🏫</div>
              <h3>Profesores</h3>
              <p>Gestión de docentes y carga lectiva.</p>
            </div>

            <!-- Gestión de Aulas -->
            <div class="card" [routerLink]="['/admin/aulas']">
              <div class="card-icon">🏫</div>
              <h3>Aulas</h3>
              <p>Espacios físicos y capacidades.</p>
            </div>

            <!-- Gestión de Alumnos -->
            <div class="card" [routerLink]="['/admin/alumnos']">
              <div class="card-icon">👤</div>
              <h3>Alumnos</h3>
              <p>Listado y matriculación de estudiantes.</p>
            </div>

            <!-- Gestión de Calendario -->
            <div class="card" [routerLink]="['/admin/examenes']">
              <div class="card-icon">⚙️</div>
              <h3>Gestión Exámenes</h3>
              <p>Motor de generación y asignación de exámenes.</p>
            </div>

            <!-- Incidencias (Solo Admin) -->
            <div class="card" [routerLink]="['/admin/incidencias']">
              <div class="card-icon">⚠️</div>
              <h3>Incidencias</h3>
              <p>Revisión de reportes de profesores.</p>
            </div>
          </ng-container>

          <!-- Tarjeta de Consulta de Calendario (Común a todos los roles) -->
          <div class="card accent" [routerLink]="['/calendario/consultar']">
            <div class="card-icon">🗓️</div>
            <h3>Consultar Calendario</h3>
            <p>Visualización interactiva y búsqueda de exámenes.</p>
          </div>

          <!-- Tarjeta de Reportar Incidencia (Solo Profesor) -->
          <div class="card warning" *ngIf="user.rol === 'Profesor'" [routerLink]="['/profesor/incidencias/crear']">
            <div class="card-icon">⚠️</div>
            <h3>Reportar Incidencia</h3>
            <p>Comunica conflictos de tus exámenes asignados.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      min-height: 100vh;
      background-color: #f1f5f9;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .top-nav {
      background: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2563eb;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
    }

    .btn-logout {
      padding: 0.5rem 1rem;
      background: #fee2e2;
      color: #dc2626;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: #fecaca;
    }

    .content {
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem 1rem;
    }

    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }

    .hero h1 {
      font-size: 2.25rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .hero p {
      color: #64748b;
      font-size: 1.125rem;
    }

    .grid-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid #e2e8f0;
      width: 300px;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      border-color: #2563eb;
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .card h3 {
      font-size: 1.25rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .card p {
      color: #64748b;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .card.accent {
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    .card.warning {
      background: #fffbeb;
      border-color: #fde68a;
    }

    .card.warning:hover {
      border-color: #d97706;
    }
  `]
})
export class HomeComponent {
  user$;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
