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
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.get<Dispensator[]>(this.baseUrl);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<{ data: Dispensator[] }>(this.baseUrl)
    //   .pipe(map(r => r.data));
  }

  // ── Get status ──────────────────────────────────────────────────────────────

  getStatus(id: number): Observable<DispensatorStatusResponse> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    // json-server doesn't support nested routes (/dispensators/:id/status),
    // so we query the flat collection and extract the first match.
    return this.http
      .get<DispensatorStatusResponse[]>(`${this.statusBaseUrl}?dispensatorId=${id}`)
      .pipe(map((results) => results[0]));

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http.get<DispensatorStatusResponse>(`${this.baseUrl}/${id}/status`);
  }
}
