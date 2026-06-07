import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GenerarCalendarioDto {
  fechaInicio: string;
  fechaFin: string;
  franjasHorarias: string[];
}

export interface ConflictInfo {
  examenId: number;
  examenCodigo: string;
  asignaturaNombre: string;
  motivo: string;
}

export interface AsignacionProposedDto {
  examenId: number;
  fecha: string;
  hora: string;
  aulaId: number;
  profesorId: number | null;
}

export interface GeneracionResultDto {
  exito: boolean;
  totalExamenes: number;
  programados: number;
  noProgramados: number;
  conflictos: ConflictInfo[];
  propuesta?: AsignacionProposedDto[];
}

export interface ConfirmarCalendarioDto {
  asignaciones: AsignacionProposedDto[];
}

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private apiUrl = `${environment.apiUrl}/calendario`;

  constructor(private http: HttpClient) {}

  generar(dto: GenerarCalendarioDto): Observable<GeneracionResultDto> {
    return this.http.post<GeneracionResultDto>(`${this.apiUrl}/generar`, dto);
  }

  confirmar(dto: ConfirmarCalendarioDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/confirmar`, dto);
  }
}
