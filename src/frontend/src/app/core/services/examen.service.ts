import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from './grado.service';

export interface Examen {
  id: number;
  codigo: string;
  fecha: string;
  hora: string;
  duracion: number;
  tipo: string;
  asignaturaId: number;
  asignatura?: {
    id: number;
    codigo: string;
    nombre: string;
    creditos: number;
  };
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
}
