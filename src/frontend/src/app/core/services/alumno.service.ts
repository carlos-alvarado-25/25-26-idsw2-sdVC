import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from './grado.service';

export interface Alumno {
  id: number;
  matricula: string;
  nombre: string;
  email: string;
  curso: number;
  gradoId: number;
  nombreGrado: string;
  grado?: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = `${environment.apiUrl}/alumnos`;

  constructor(private http: HttpClient) {}

  listar(page: number = 1): Observable<PagedResult<Alumno>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PagedResult<Alumno>>(this.apiUrl, { params });
  }

  crear(alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno);
  }

  obtenerPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.patch<Alumno>(`${this.apiUrl}/${id}`, alumno);
  }

  eliminarBulk(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: { ids } });
  }

  importar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/importar`, formData);
  }

  filtrar(criterio: string, page: number = 1): Observable<PagedResult<Alumno>> {
    const params = new HttpParams()
      .set('q', criterio)
      .set('page', page.toString());
    return this.http.get<PagedResult<Alumno>>(`${this.apiUrl}/search`, { params });
  }
}
