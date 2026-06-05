import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from './grado.service';

export interface Profesor {
  id: number;
  codigo: string;
  nombre: string;
  email: string;
  departamento: string;
  cargaLectivaTexto: string;
  asignaturas?: {
    id: number;
    nombre: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = `${environment.apiUrl}/profesores`;

  constructor(private http: HttpClient) {}

  listar(page: number = 1): Observable<PagedResult<Profesor>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PagedResult<Profesor>>(this.apiUrl, { params });
  }

  crear(profesor: Partial<Profesor>): Observable<Profesor> {
    return this.http.post<Profesor>(this.apiUrl, profesor);
  }

  obtenerPorId(id: number): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, profesor: Partial<Profesor>): Observable<Profesor> {
    return this.http.patch<Profesor>(`${this.apiUrl}/${id}`, profesor);
  }

  eliminarBulk(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: { ids } });
  }

  obtenerImpacto(id: number): Observable<{ examenesCount: number }> {
    return this.http.get<{ examenesCount: number }>(`${this.apiUrl}/${id}/impacto`);
  }

  importar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/importar`, formData);
  }

  filtrar(criterio: string, page: number = 1): Observable<PagedResult<Profesor>> {
    const params = new HttpParams()
      .set('q', criterio)
      .set('page', page.toString());
    return this.http.get<PagedResult<Profesor>>(`${this.apiUrl}/search`, { params });
  }
}
