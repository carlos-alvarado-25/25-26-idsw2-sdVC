import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Grado {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class GradoService {
  private apiUrl = `${environment.apiUrl}/grados`;

  constructor(private http: HttpClient) {}

  listar(page: number = 1): Observable<PagedResult<Grado>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PagedResult<Grado>>(this.apiUrl, { params });
  }

  crear(grado: Partial<Grado>): Observable<Grado> {
    return this.http.post<Grado>(this.apiUrl, grado);
  }

  obtenerPorId(id: number): Observable<Grado> {
    return this.http.get<Grado>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, grado: Partial<Grado>): Observable<Grado> {
    return this.http.patch<Grado>(`${this.apiUrl}/${id}`, grado);
  }

  verificarImpacto(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/impacto`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  importar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/importar`, formData);
  }

  filtrar(criterio: string, page: number = 1): Observable<PagedResult<Grado>> {

    const params = new HttpParams()
      .set('q', criterio)
      .set('page', page.toString());
    return this.http.get<PagedResult<Grado>>(`${this.apiUrl}/search`, { params });
  }
}
