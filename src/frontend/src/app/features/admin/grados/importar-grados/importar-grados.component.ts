import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GradoService } from '../../../../core/services/grado.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-importar-grados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './importar-grados.component.html',
  styleUrls: ['./importar-grados.component.css']
})
export class ImportarGradosComponent {
  selectedFile: File | null = null;
  loading = signal(false);
  result = signal<any>(null);
  error = signal<string | null>(null);

  constructor(private gradoService: GradoService) {}

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

    this.gradoService.importar(this.selectedFile)
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
