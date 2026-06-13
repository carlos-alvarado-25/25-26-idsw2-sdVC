import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamenService, Examen } from '../../../core/services/examen.service';
import { GradoService, Grado } from '../../../core/services/grado.service';
import { AsignaturaService, Asignatura } from '../../../core/services/asignatura.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { AlumnoService } from '../../../core/services/alumno.service';
import { forkJoin, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

interface CalendarDay {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  exams: Examen[];
}

@Component({
  selector: 'app-consultar-calendario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './consultar-calendario.component.html',
  styleUrls: ['./consultar-calendario.component.css']
})
export class ConsultarCalendarioComponent implements OnInit {
  // Configuración de fecha y vista
  currentDate = signal<Date>(new Date());
  viewMode = signal<'month' | 'week' | 'day'>('month');
  
  // Datos y filtros
  exams = signal<Examen[]>([]);
  grados = signal<Grado[]>([]);
  asignaturas = signal<Asignatura[]>([]);
  
  selectedGradoId = signal<number | null>(null);
  selectedAsignaturaId = signal<number | null>(null);
  
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  currentUser = signal<User | null>(null);
  
  // Días de la semana en español
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Nombre del mes actual en español
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    private readonly examenService: ExamenService,
    private readonly gradoService: GradoService,
    private readonly asignaturaService: AsignaturaService,
    private readonly authService: AuthService,
    private readonly alumnoService: AlumnoService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      this.currentUser.set(user);
      
      // Cargar filtros iniciales
      this.cargarFiltros();
      
      // Cargar exámenes correspondientes
      this.cargarExamenes();
    });
  }

  cargarFiltros(): void {
    const user = this.currentUser();
    
    if (user && user.rol === 'Alumno') {
      // Si el usuario es un Alumno, resolvemos su Grado a partir de su email para cargar SOLO sus asignaturas
      this.alumnoService.filtrar(user.email).subscribe({
        next: (res: any) => {
          if (res.data && res.data.length > 0) {
            const student = res.data[0];
            this.cargarAsignaturasPorGrado(student.gradoId);
          }
        },
        error: (err: any) => {
          console.error('Error al resolver grado del alumno:', err);
        }
      });
    } else if (user && user.rol === 'Admin') {
      // Solo el Admin necesita los filtros de Grado y Asignatura
      this.gradoService.listar(1).subscribe({
        next: (res: any) => {
          this.grados.set(res.data || []);
        },
        error: (err: any) => {
          console.error('Error al cargar grados:', err);
        }
      });
      this.cargarAsignaturasPorGrado(null);
    }
    // Para Profesor: no se cargan filtros académicos.
    // El backend filtra automáticamente por usuarioId.
  }

  onGradoChange(gradoId: number | null): void {
    this.selectedGradoId.set(gradoId);
    this.selectedAsignaturaId.set(null); // Reset asignatura
    this.cargarAsignaturasPorGrado(gradoId);
    this.cargarExamenes();
  }

  onAsignaturaChange(asignaturaId: number | null): void {
    this.selectedAsignaturaId.set(asignaturaId);
    this.cargarExamenes();
  }

  cargarAsignaturasPorGrado(gradoId: number | null): void {
    if (gradoId) {
      this.asignaturaService.buscarPorGrado(gradoId).subscribe({
        next: (data: any) => {
          this.asignaturas.set(data || []);
        },
        error: (err: any) => {
          console.error('Error al cargar asignaturas por grado:', err);
        }
      });
    } else {
      // Cargar algunas asignaturas iniciales (por ejemplo, página 1)
      this.asignaturaService.listar(1).subscribe({
        next: (res: any) => {
          this.asignaturas.set(res.data || []);
        },
        error: (err: any) => {
          console.error('Error al listar asignaturas:', err);
        }
      });
    }
  }

  // Carga exámenes según el rango de fechas de la vista actual y filtros seleccionados
  cargarExamenes(): void {
    const dates = this.getRangeDates();
    if (!dates) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    const user = this.currentUser();
    const queryParams: any = {
      fechaInicio: this.formatDate(dates.start),
      fechaFin: this.formatDate(dates.end),
      rol: user?.rol,
      email: user?.email,
      usuarioId: user?.id
    };

    if (this.selectedGradoId()) {
      queryParams.gradoId = this.selectedGradoId();
    }
    if (this.selectedAsignaturaId()) {
      queryParams.asignaturaId = this.selectedAsignaturaId();
    }

    this.examenService.obtenerCalendario(queryParams)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: any) => {
          this.exams.set(data || []);
        },
        error: (err: any) => {
          console.error('Error al obtener exámenes del calendario:', err);
          this.errorMsg.set(err.error?.message || 'Error al obtener exámenes.');
        }
      });
  }

  // Obtiene las fechas de inicio y fin para la consulta API según la vista activa
  getRangeDates(): { start: Date; end: Date } {
    const date = this.currentDate();
    const mode = this.viewMode();

    if (mode === 'month') {
      const year = date.getFullYear();
      const month = date.getMonth();
      // Obtenemos los días que se renderizan en la cuadrícula mensual (incluyendo desbordes)
      const firstDay = new Date(year, month, 1);
      let startOffset = firstDay.getDay() - 1;
      if (startOffset === -1) startOffset = 6;
      
      const start = new Date(year, month, 1 - startOffset);
      const end = new Date(start);
      end.setDate(start.getDate() + 41); // 42 días en total

      return { start, end };
    } else if (mode === 'week') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(date.setDate(diff));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    } else {
      // day view
      const start = new Date(date);
      const end = new Date(date);
      return { start, end };
    }
  }

  // Genera la lista de días a renderizar en la vista mensual
  calendarDays = computed<CalendarDay[]>(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const examList = this.exams();
    
    const firstDay = new Date(year, month, 1);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6;

    // Indexado lineal O(N) para acceso inmediato
    const examsByDate = new Map<string, Examen[]>();
    for (const ex of examList) {
      if (ex.fecha) {
        if (!examsByDate.has(ex.fecha)) {
          examsByDate.set(ex.fecha, []);
        }
        examsByDate.get(ex.fecha)!.push(ex);
      }
    }

    const days: CalendarDay[] = [];
    const today = new Date();
    const todayStr = this.formatDate(today);

    // 42 celdas en total (6 filas de 7 días)
    const startDate = new Date(year, month, 1 - startOffset);
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dStr = this.formatDate(d);
      
      days.push({
        date: d,
        dateStr: dStr,
        isCurrentMonth: d.getMonth() === month,
        isToday: dStr === todayStr,
        exams: examsByDate.get(dStr) || []
      });
    }

    return days;
  });

  // Genera los días de la semana activa
  weeklyDays = computed<CalendarDay[]>(() => {
    const date = this.currentDate();
    const examList = this.exams();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    
    // Indexado lineal O(N)
    const examsByDate = new Map<string, Examen[]>();
    for (const ex of examList) {
      if (ex.fecha) {
        if (!examsByDate.has(ex.fecha)) {
          examsByDate.set(ex.fecha, []);
        }
        examsByDate.get(ex.fecha)!.push(ex);
      }
    }

    const monday = new Date(date.getFullYear(), date.getMonth(), diff);
    const days: CalendarDay[] = [];
    const todayStr = this.formatDate(new Date());

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = this.formatDate(d);

      days.push({
        date: d,
        dateStr: dStr,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        exams: examsByDate.get(dStr) || []
      });
    }

    return days;
  });

  // Exámenes del día actual (para vista diaria)
  dailyExams = computed<Examen[]>(() => {
    const dStr = this.formatDate(this.currentDate());
    return this.exams().filter(e => e.fecha === dStr);
  });

  // Navegación temporal
  prev(): void {
    const date = this.currentDate();
    const mode = this.viewMode();
    const newDate = new Date(date);

    if (mode === 'month') {
      newDate.setMonth(date.getMonth() - 1);
    } else if (mode === 'week') {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setDate(date.getDate() - 1);
    }

    this.currentDate.set(newDate);
    this.cargarExamenes();
  }

  next(): void {
    const date = this.currentDate();
    const mode = this.viewMode();
    const newDate = new Date(date);

    if (mode === 'month') {
      newDate.setMonth(date.getMonth() + 1);
    } else if (mode === 'week') {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setDate(date.getDate() + 1);
    }

    this.currentDate.set(newDate);
    this.cargarExamenes();
  }

  today(): void {
    this.currentDate.set(new Date());
    this.cargarExamenes();
  }

  setViewMode(mode: 'month' | 'week' | 'day'): void {
    this.viewMode.set(mode);
    this.cargarExamenes();
  }

  // Texto descriptivo del período actual en la cabecera del calendario
  get periodLabel(): string {
    const date = this.currentDate();
    const mode = this.viewMode();

    if (mode === 'month') {
      return `${this.monthNames[date.getMonth()]} de ${date.getFullYear()}`;
    } else if (mode === 'week') {
      const dates = this.getRangeDates();
      return `Semana del ${dates.start.getDate()} ${this.monthNames[dates.start.getMonth()]} al ${dates.end.getDate()} ${this.monthNames[dates.end.getMonth()]} de ${dates.end.getFullYear()}`;
    } else {
      return `${date.getDate()} de ${this.monthNames[date.getMonth()]} de ${date.getFullYear()}`;
    }
  }

  // Reportar Incidencia (para profesores)
  reportarIncidencia(examenId: number): void {
    this.router.navigate(['/profesor/incidencias/crear', examenId]);
  }

  // Formateador de fecha YYYY-MM-DD
  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Finalizar consulta (Transition)
  volver(): void {
    this.router.navigate(['/home']);
  }

  // Modal de descarga
  isDownloadModalOpen = signal(false);
  downloadFormat = signal<'pdf' | 'excel'>('pdf');
  downloadFechaInicio = signal<string>('');
  downloadFechaFin = signal<string>('');
  includeAula = signal(true);
  includeProfesor = signal(true);
  includeGrado = signal(true);

  abrirModalDescarga(): void {
    const dates = this.getRangeDates();
    if (dates) {
      this.downloadFechaInicio.set(this.formatDate(dates.start));
      this.downloadFechaFin.set(this.formatDate(dates.end));
    }
    this.isDownloadModalOpen.set(true);
  }

  cerrarModalDescarga(): void {
    this.isDownloadModalOpen.set(false);
  }

  confirmarDescarga(): void {
    const user = this.currentUser();
    const queryParams: any = {
      fechaInicio: this.downloadFechaInicio(),
      fechaFin: this.downloadFechaFin(),
      rol: user?.rol,
      email: user?.email,
      formato: this.downloadFormat(),
      incluirAula: this.includeAula(),
      incluirProfesor: this.includeProfesor(),
      incluirGrado: this.includeGrado()
    };

    if (this.selectedGradoId()) {
      queryParams.gradoId = this.selectedGradoId();
    }
    if (this.selectedAsignaturaId()) {
      queryParams.asignaturaId = this.selectedAsignaturaId();
    }

    const downloadUrl = this.examenService.obtenerUrlExportacion(queryParams);
    
    // Simular descarga
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = `calendario.${this.downloadFormat() === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.cerrarModalDescarga();
  }
}
