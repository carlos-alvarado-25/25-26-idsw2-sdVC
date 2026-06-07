import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from './grado.service';
import { Asignatura } from './asignatura.service';

export interface ConflictoAlumno {
  examenId: number;
  examenCodigo: string;
  asignaturaNombre: string;
  gradoNombre: string;
  fecha: string;
  hora: string;
  duracion: number;
  solapaConExamenId: number;
  solapaConExamenCodigo: string;
  solapaConAsignaturaNombre: string;
  motivoConflicto: string;
  tipoConflicto: string;
}

export interface Examen {
  id: number;
  codigo: string;
  fecha: string;
  hora: string;
  duracion: number;
  tipo: string;
  asignaturaId: number;
  nombreAsignatura: string;
  codigoAsignatura: string;
  nombreAula: string;
  nombreProfesor: string;
  asignatura?: Asignatura;
  aulaId?: number | null;
  aula?: {
    id: number;
    codigo: string;
    nombre: string;
    capacidad: number;
  } | null;
  profesorId?: number | null;
  profesor?: {
    id: number;
    codigo: string;
    nombre: string;
    departamento: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private apiUrl = `${environment.apiUrl}/examenes`;

  constructor(private http: HttpClient) {}

  listar(page: number = 1): Observable<PagedResult<Examen>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PagedResult<Examen>>(this.apiUrl, { params });
  }

  crear(examen: Partial<Examen>): Observable<Examen> {
    return this.http.post<Examen>(this.apiUrl, examen);
  }

  obtenerPorId(id: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, examen: Partial<Examen>): Observable<Examen> {
    return this.http.patch<Examen>(`${this.apiUrl}/${id}`, examen);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filtrar(criterio: string, page: number = 1): Observable<PagedResult<Examen>> {
    const params = new HttpParams()
      .set('q', criterio)
      .set('page', page.toString());
    return this.http.get<PagedResult<Examen>>(`${this.apiUrl}/search`, { params });
  }

  buscarSinProfesor(criterio: string = '', page: number = 1): Observable<PagedResult<Examen>> {
    const params = new HttpParams()
      .set('q', criterio)
      .set('page', page.toString());
    return this.http.get<PagedResult<Examen>>(`${this.apiUrl}/sin-profesor`, { params });
  }

  verificarConflictoProfesor(examenId: number, profesorId: number): Observable<{ tieneConflicto: boolean; descripcion?: string }> {
    const params = new HttpParams().set('profesorId', profesorId.toString());
    return this.http.get<{ tieneConflicto: boolean; descripcion?: string }>(
      `${this.apiUrl}/${examenId}/conflicto-profesor`, { params }
    );
  }

  obtenerConflictos(profesorId: number): Observable<ConflictoAlumno[]> {
    const params = new HttpParams().set('profesorId', profesorId.toString());
    return this.http.get<ConflictoAlumno[]>(`${this.apiUrl}/conflictos`, { params });
  }

  obtenerCalendario(queryParams: {
    fechaInicio?: string;
    fechaFin?: string;
    gradoId?: number;
    asignaturaId?: number;
    rol?: string;
    email?: string;
  }): Observable<Examen[]> {
    let params = new HttpParams();
    if (queryParams.fechaInicio) params = params.set('fechaInicio', queryParams.fechaInicio);
    if (queryParams.fechaFin) params = params.set('fechaFin', queryParams.fechaFin);
    if (queryParams.gradoId) params = params.set('gradoId', queryParams.gradoId.toString());
    if (queryParams.asignaturaId) params = params.set('asignaturaId', queryParams.asignaturaId.toString());
    if (queryParams.rol) params = params.set('rol', queryParams.rol);
    if (queryParams.email) params = params.set('email', queryParams.email);

    return this.http.get<Examen[]>(`${this.apiUrl}/calendario`, { params });
  }
  obtenerUrlExportacion(queryParams: {
    fechaInicio?: string;
    fechaFin?: string;
    gradoId?: number | null;
    asignaturaId?: number | null;
    rol?: string;
    email?: string;
    formato: string;
    incluirAula: boolean;
    incluirProfesor: boolean;
    incluirGrado: boolean;
  }): string {
    const params = new URLSearchParams();
    if (queryParams.fechaInicio) params.set('fechaInicio', queryParams.fechaInicio);
    if (queryParams.fechaFin) params.set('fechaFin', queryParams.fechaFin);
    if (queryParams.gradoId) params.set('gradoId', queryParams.gradoId.toString());
    if (queryParams.asignaturaId) params.set('asignaturaId', queryParams.asignaturaId.toString());
    if (queryParams.rol) params.set('rol', queryParams.rol);
    if (queryParams.email) params.set('email', queryParams.email);
    params.set('formato', queryParams.formato);
    params.set('incluirAula', queryParams.incluirAula ? 'true' : 'false');
    params.set('incluirProfesor', queryParams.incluirProfesor ? 'true' : 'false');
    params.set('incluirGrado', queryParams.incluirGrado ? 'true' : 'false');

    return `${this.apiUrl}/exportar?${params.toString()}`;
  }
}
