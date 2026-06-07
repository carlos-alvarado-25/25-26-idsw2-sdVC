import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult } from './grado.service';

export interface Asignatura {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
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
export class AsignaturaService {
  private apiUrl = `${environment.apiUrl}/asignaturas`;

  constructor(private http: HttpClient) {}

  listar(page: number = 1): Observable<PagedResult<Asignatura>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PagedResult<Asignatura>>(this.apiUrl, { params });
  }

  crear(asignatura: Partial<Asignatura>): Observable<Asignatura> {
    return this.http.post<Asignatura>(this.apiUrl, asignatura);
  }

  obtenerPorId(id: number): Observable<Asignatura> {
    return this.http.get<Asignatura>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, asignatura: Partial<Asignatura>): Observable<Asignatura> {
    return this.http.patch<Asignatura>(`${this.apiUrl}/${id}`, asignatura);
  }

  verificarImpacto(id: number): Observable<{ examenesAsociados: number }> {
    return this.http.get<{ examenesAsociados: number }>(`${this.apiUrl}/${id}/impacto`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  eliminarBulk(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: { ids } });
  }

  importar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/importar`, formData);
  }

  filtrar(criterio: string, page: number = 1): Observable<PagedResult<Asignatura>> {
    const params = new HttpParams()
      .set('q', criterio)
      .set('page', page.toString());
    return this.http.get<PagedResult<Asignatura>>(`${this.apiUrl}/search`, { params });
  }

  buscarPorGrado(gradoId: number): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.apiUrl}/por-grado/${gradoId}`);
  }
}
