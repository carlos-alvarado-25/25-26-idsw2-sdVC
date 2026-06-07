import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalendarioService, GeneracionResultDto, AsignacionProposedDto } from '../../../../core/services/calendario.service';
import { finalize } from 'rxjs';

interface FranjaSeleccionable {
  valor: string;
  seleccionada: boolean;
}

@Component({
  selector: 'app-generar-calendario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './generar-calendario.component.html',
  styleUrls: ['./generar-calendario.component.css']
})
export class GenerarCalendarioComponent {
  fechaInicio = '';
  fechaFin = '';
  nuevaFranja = '';
  
  franjas = signal<FranjaSeleccionable[]>([
    { valor: '08:00-10:00', seleccionada: true },
    { valor: '10:00-12:00', seleccionada: true },
    { valor: '12:00-14:00', seleccionada: true },
    { valor: '16:00-18:00', seleccionada: true },
    { valor: '18:00-20:00', seleccionada: true }
  ]);

  loading = signal(false);
  saving = signal(false);
  result = signal<GeneracionResultDto | null>(null);
  propuesta = signal<AsignacionProposedDto[] | null>(null);
  errorMsg = signal<string | null>(null);

  constructor(
    private readonly calendarioService: CalendarioService,
    private readonly router: Router
  ) {}

  toggleFranja(index: number): void {
    const copia = [...this.franjas()];
    copia[index].seleccionada = !copia[index].seleccionada;
    this.franjas.set(copia);
  }

  addFranja(): void {
    const valor = this.nuevaFranja.trim();
    if (!valor) return;

    // Validación básica de formato HH:mm-HH:mm
    const regex = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(valor)) {
      this.errorMsg.set('Formato de franja inválido. Use HH:mm-HH:mm (ej: 09:00-11:00)');
      return;
    }

    if (this.franjas().some(f => f.valor === valor)) {
      this.errorMsg.set('La franja ya existe.');
      return;
    }

    this.franjas.update(actual => [...actual, { valor, seleccionada: true }]);
    this.nuevaFranja = '';
    this.errorMsg.set(null);
  }

  removeFranja(index: number, event: Event): void {
    event.stopPropagation();
    this.franjas.update(actual => actual.filter((_, i) => i !== index));
  }

  generar(): void {
    this.errorMsg.set(null);
    this.result.set(null);
    this.propuesta.set(null);

    if (!this.fechaInicio || !this.fechaFin) {
      this.errorMsg.set('Debe seleccionar la fecha de inicio y de fin.');
      return;
    }

    if (new Date(this.fechaInicio) > new Date(this.fechaFin)) {
      this.errorMsg.set('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    const franjasSeleccionadas = this.franjas()
      .filter(f => f.seleccionada)
      .map(f => f.valor);

    if (franjasSeleccionadas.length === 0) {
      this.errorMsg.set('Debe seleccionar al menos una franja horaria para la programación.');
      return;
    }

    this.loading.set(true);

    const dto = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      franjasHorarias: franjasSeleccionadas
    };

    this.calendarioService.generar(dto)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.result.set(res);
          this.propuesta.set(res.propuesta || null);
        },
        error: (err) => {
          console.error('Error al generar calendario:', err);
          this.errorMsg.set(err.error?.message || 'Ocurrió un error inesperado en el servidor al generar el calendario.');
        }
      });
  }

  confirmar(): void {
    const list = this.propuesta();
    if (!list || list.length === 0) return;

    this.saving.set(true);
    this.errorMsg.set(null);

    this.calendarioService.confirmar({ asignaciones: list })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/examenes']);
        },
        error: (err) => {
          console.error('Error al confirmar calendario:', err);
          this.errorMsg.set(err.error?.message || 'Ocurrió un error inesperado al guardar el calendario.');
        }
      });
  }
}
