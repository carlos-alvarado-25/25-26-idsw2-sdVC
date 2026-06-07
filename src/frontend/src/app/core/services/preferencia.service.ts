import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Preferencia {
  id: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
  profesorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PreferenciaService {
  private apiUrl = `${environment.apiUrl}/profesores`;

  constructor(private http: HttpClient) {}

  listar(profesorId: number): Observable<Preferencia[]> {
    return this.http.get<Preferencia[]>(`${this.apiUrl}/${profesorId}/preferencias`);
  }

  crear(profesorId: number, preferencia: Partial<Preferencia>): Observable<Preferencia> {
    return this.http.post<Preferencia>(`${this.apiUrl}/${profesorId}/preferencias`, preferencia);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/preferencias/${id}`);
  }
}
