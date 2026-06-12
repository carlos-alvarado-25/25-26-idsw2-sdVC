import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Incidencia {
  id: number;
  tipo: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'RESUELTA' | 'RECHAZADA';
  examenId: number;
  profesorId: number;
  codigoExamen?: string;
  nombreAsignatura?: string;
  nombreProfesor?: string;
  profesor?: {
    id: number;
    codigo: string;
    nombre: string;
    departamento: string;
  } | null;
  examen?: {
    id: number;
    codigo: string;
    fecha: string;
    hora: string;
    duracion: number;
    tipo: string;
  } | null;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = `${environment.apiUrl}/incidencias`;

  constructor(private http: HttpClient) {}

  crear(incidencia: { examenId: number; tipo: string; descripcion: string }, email: string): Observable<Incidencia> {
    const params = new HttpParams().set('email', email);
    return this.http.post<Incidencia>(this.apiUrl, incidencia, { params });
  }

  listar(email?: string, rol?: string): Observable<Incidencia[]> {
    let params = new HttpParams();
    if (email) params = params.set('email', email);
    if (rol) params = params.set('rol', rol);
    return this.http.get<Incidencia[]>(this.apiUrl, { params });
  }

  actualizarEstado(id: number, estado: 'PENDIENTE' | 'RESUELTA' | 'RECHAZADA'): Observable<Incidencia> {
    return this.http.patch<Incidencia>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
