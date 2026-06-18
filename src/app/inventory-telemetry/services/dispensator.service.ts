import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dispensator } from '../model/entities/dispensator.entity';
import { DispensatorStatusResponse } from '../model/response/dispensator-status.response';

@Injectable({ providedIn: 'root' })
export class DispensatorService {
  private baseUrl = `${environment.apiBaseUrl}${environment.dispensatorsPath}`;

  // Separate base for the flat status collection used by json-server mock
  private statusBaseUrl = `${environment.apiBaseUrl}/dispensator-status`;

  private http = inject(HttpClient);
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  // ── Get all ─────────────────────────────────────────────────────────────────

  getAll(): Observable<Dispensator[]> {
    return this.http.get<Dispensator[]>(this.baseUrl);
  }

  // ── Get status ──────────────────────────────────────────────────────────────

  getStatus(id: number): Observable<DispensatorStatusResponse> {
    // El endpoint GET /dispensators/{id} ya devuelve el status directamente
    return this.http.get<DispensatorStatusResponse>(`${this.baseUrl}/${id}`);
  }
}
