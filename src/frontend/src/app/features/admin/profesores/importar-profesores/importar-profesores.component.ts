import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfesorService } from '../../../../core/services/profesor.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-importar-profesores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './importar-profesores.component.html',
  styleUrls: ['./importar-profesores.component.css']
})
export class ImportarProfesoresComponent {
  selectedFile: File | null = null;
  loading = signal(false);
  result = signal<any>(null);
  error = signal<string | null>(null);

  constructor(private profesorService: ProfesorService) {}

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

    this.profesorService.importar(this.selectedFile)
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
