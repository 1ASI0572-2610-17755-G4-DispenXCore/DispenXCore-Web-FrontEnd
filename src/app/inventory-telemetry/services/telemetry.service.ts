import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DispenserEvent } from '../model/entities/dispenserEvent.entity';
import { DispenserEventListResponse } from '../model/response/dispenser-event.response';

export type HistoryPeriod = 7 | 30;

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private baseUrl = `${environment.apiBaseUrl}${environment.dispenserEventsPath}`;

  private http = inject(HttpClient);

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  // ── Get history ─────────────────────────────────────────────────────────────

  getHistory(dispensatorId: number, period: HistoryPeriod): Observable<DispenserEvent[]> {
    const since = this._sinceDate(period);

    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.get<DispenserEvent[]>(
      `${this.baseUrl}?dispensatorId=${dispensatorId}&dispensedAt_gte=${since}`,
    );

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<DispenserEventListResponse>(
    //     `${this.baseUrl}?dispensatorId=${dispensatorId}&period=${period}`
    //   )
    //   .pipe(map(r => r.data));
  }

  // ── Get summary ─────────────────────────────────────────────────────────────

  getSummary(dispensatorId: number, period: HistoryPeriod): Observable<DispenserEventListResponse> {
    const since = this._sinceDate(period);

    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.get<DispenserEventListResponse>(
      `${this.baseUrl}?dispensatorId=${dispensatorId}&dispensedAt_gte=${since}`,
    );

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http.get<DispenserEventListResponse>(
    //   `${this.baseUrl}/summary?dispensatorId=${dispensatorId}&period=${period}`
    // );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private _sinceDate(period: HistoryPeriod): string {
    const date = new Date();
    date.setDate(date.getDate() - period);
    return date.toISOString();
  }
}
