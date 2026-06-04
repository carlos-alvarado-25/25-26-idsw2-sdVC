import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-importar-alumnos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './importar-alumnos.component.html',
  styleUrls: ['./importar-alumnos.component.css']
})
export class ImportarAlumnosComponent {
  selectedFile: File | null = null;
  loading = signal(false);
  result = signal<any>(null);
  error = signal<string | null>(null);

  constructor(private alumnoService: AlumnoService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.error.set(null);
      this.result.set(null);
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.alumnoService.importar(this.selectedFile)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.result.set(res);
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Error al importar:', err);
          this.error.set(err.error?.message || 'Error al procesar el archivo');
        }
      });
  }
}
