import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Aula {
  id: number;
  codigo: string;
  nombre: string;
  capacidad: number;
  edificio: string;
  planta: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  private apiUrl = `${environment.apiUrl}/aulas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl);
  }

  crear(aula: Partial<Aula>): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl, aula);
  }

  obtenerPorId(id: number): Observable<Aula> {
    return this.http.get<Aula>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, aula: Partial<Aula>): Observable<Aula> {
    return this.http.patch<Aula>(`${this.apiUrl}/${id}`, aula);
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

  filtrar(criterio: string): Observable<Aula[]> {
    const params = new HttpParams().set('q', criterio);
    return this.http.get<Aula[]>(`${this.apiUrl}/search`, { params });
  }
}
