import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Bienvenido al Generador de Calendarios</h1>
      <p *ngIf="user$ | async as user">Usuario: {{ user.email }} ({{ user.rol }})</p>
      <button (click)="logout()" style="padding: 10px; background: #dc3545; color: white; border: none; cursor: pointer;">
        Cerrar Sesión
      </button>
    </div>
  `
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
