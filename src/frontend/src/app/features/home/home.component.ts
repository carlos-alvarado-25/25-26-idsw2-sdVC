import { Component, OnInit, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrapper">
      <nav class="top-nav">
        <div class="nav-left">
          <div class="logo">📅 Davidario</div>
        </div>
        <div class="nav-right" *ngIf="user$ | async as user">
          <button (click)="toggleTheme()" class="btn-theme" [title]="isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
            {{ isDark() ? '☀️' : '🌙' }}
          </button>
          <div class="user-pill">
            <span class="user-email">{{ user.email }}</span>
            <span class="user-role">{{ user.rol }}</span>
          </div>
          <button (click)="logout()" class="btn-logout" title="Cerrar sesión">🚪</button>
        </div>
      </nav>

      <main class="content">
        <header class="hero">
          <h1>Gestión Académica</h1>
          <p>Bienvenido al centro de control. Seleccione un módulo para comenzar.</p>
        </header>

        <div class="grid-container">
          <div class="card" [routerLink]="['/admin/grados']">
            <div class="card-icon">🎓</div>
            <h3>Grados</h3>
            <p>Titulaciones y facultades</p>
          </div>

          <div class="card" [routerLink]="['/admin/asignaturas']">
            <div class="card-icon">📚</div>
            <h3>Asignaturas</h3>
            <p>Materias y créditos</p>
          </div>

          <div class="card" [routerLink]="['/admin/profesores']">
            <div class="card-icon">👨‍🏫</div>
            <h3>Profesores</h3>
            <p>Carga docente y perfiles</p>
          </div>

          <div class="card" [routerLink]="['/admin/aulas']">
            <div class="card-icon">🏫</div>
            <h3>Aulas</h3>
            <p>Espacios y logística</p>
          </div>

          <div class="card" [routerLink]="['/admin/alumnos']">
            <div class="card-icon">👤</div>
            <h3>Alumnos</h3>
            <p>Censo y matriculación</p>
          </div>

          <div class="card accent" [routerLink]="['/admin/examenes']">
            <div class="card-icon">🗓️</div>
            <h3>Calendario</h3>
            <p>Motor de exámenes</p>
          </div>
        </div>
      </main>
      
      <footer class="home-footer">
        <p>© 2026 IdSw 2 · Sistema de Generación de Calendarios</p>
      </footer>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .top-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(var(--rgb-surface), 0.8);
      backdrop-filter: blur(12px);
      padding: 0.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.02em;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-theme {
      background: var(--bg-surface-soft);
      border: 1px solid var(--border);
      font-size: 1.125rem;
      padding: 0.4rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all var(--t-normal);
    }
    
    .btn-theme:hover { transform: rotate(12deg) scale(1.1); }

    .user-pill {
      background: var(--bg-surface-soft);
      padding: 0.375rem 0.75rem;
      border-radius: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid var(--border);
    }

    .user-email { font-size: 0.8125rem; font-weight: 500; }
    .user-role { 
      font-size: 0.6875rem; 
      font-weight: 700; 
      text-transform: uppercase; 
      background: var(--primary); 
      color: white; 
      padding: 0.125rem 0.5rem; 
      border-radius: 1rem;
    }

    .btn-logout {
      background: var(--danger-soft);
      color: var(--danger);
      border: none;
      padding: 0.5rem;
      border-radius: 0.75rem;
      cursor: pointer;
      font-size: 1.25rem;
      transition: all var(--t-normal);
    }

    .btn-logout:hover { background: var(--danger); color: white; transform: translateX(2px); }

    .content {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
      width: 100%;
    }

    .hero {
      text-align: center;
      margin-bottom: 5rem;
    }

    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero p {
      color: var(--text-muted);
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2.5rem;
    }

    .card {
      background: var(--bg-surface);
      padding: 3.5rem 2rem;
      border-radius: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all var(--t-slow);
      border: 1.5px solid var(--border);
      position: relative;
      box-shadow: var(--sh-sm);
    }

    .card:hover {
      transform: translateY(-12px);
      box-shadow: var(--sh-xl);
      border-color: var(--primary);
    }

    .card-icon {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      transition: transform var(--t-normal);
    }
    
    .card:hover .card-icon { transform: scale(1.1); }

    .card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .card p {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .card.accent {
      background: linear-gradient(145deg, var(--bg-surface) 0%, var(--primary-soft) 100%);
      border-color: var(--primary);
    }

    .home-footer {
      padding: 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8125rem;
      border-top: 1px solid var(--border);
    }

    @media (max-width: 640px) {
      .hero h1 { font-size: 2.5rem; }
      .content { padding: 2rem 1rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  user$;
  isDark;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private themeService: ThemeService
  ) {
    this.user$ = this.authService.user$;
    this.isDark = this.themeService.isDark;
  }

  ngOnInit() {
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
