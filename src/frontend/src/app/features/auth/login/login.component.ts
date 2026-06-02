import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          console.log('Login exitoso:', res);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error en login:', err);
          this.error = err.error?.message || 'Error al iniciar sesión';
        }
      });
  }
}
