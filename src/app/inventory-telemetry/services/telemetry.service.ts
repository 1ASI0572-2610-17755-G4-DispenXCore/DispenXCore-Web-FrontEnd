import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DispenserEvent, DispenseTrigger } from '../model/entities/dispenserEvent.entity';
import { DispenserEventListResponse } from '../model/response/dispenser-event.response';
import { SupplyType } from '../model/entities/supply-type.model';

export type HistoryPeriod = 7 | 30;

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private baseUrl = `${environment.apiBaseUrl}${environment.dispenserEventsPath}`;

  private http = inject(HttpClient);

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  private parseSupplyType(value: any): SupplyType {
    const map: Record<number, SupplyType> = {
      0: SupplyType.Rice,
      1: SupplyType.Lentils,
      2: SupplyType.Beans,
      3: SupplyType.Corn,
      4: SupplyType.Other,
    };
    return typeof value === 'number' ? (map[value] ?? SupplyType.Other) : (value as SupplyType);
  }
  private parseTrigger(value: any): DispenseTrigger {
    const map: Record<number, DispenseTrigger> = { 0: 'app', 1: 'manual' };
    return typeof value === 'number' ? (map[value] ?? 'app') : (value as DispenseTrigger);
  }
  private parseEvent(e: DispenserEvent): DispenserEvent {
    return {
      ...e,
      supplyType: this.parseSupplyType(e.supplyType),
      trigger: this.parseTrigger(e.trigger),
    };
  }
  // ── Get history ─────────────────────────────────────────────────────────────

  getHistory(dispensatorId: number, period: HistoryPeriod): Observable<DispenserEvent[]> {
    const from = new Date();
    from.setDate(from.getDate() - period);

    return this.http.get<DispenserEvent[]>(`${this.baseUrl}?dispensatorId=${dispensatorId}`).pipe(
      map((events) =>
        events
          .filter((e) => new Date(e.dispensedAt) >= from) // ← filtro en front
          .map((e) => this.parseEvent(e)),
      ),
    );
  }

  // ── Get summary ─────────────────────────────────────────────────────────────

  getSummary(dispensatorId: number, period: HistoryPeriod): Observable<DispenserEventListResponse> {
    const from = this._sinceDate(period);
    return this.http
      .get<DispenserEventListResponse>(
        `${this.baseUrl}?dispensatorId=${dispensatorId}&from=${from}`,
      )
      .pipe(
        map((response) => ({
          ...response,
          // si el response tiene un array de eventos, parsearlos también
          data: Array.isArray((response as any).data)
            ? (response as any).data.map((e: DispenserEvent) => this.parseEvent(e))
            : response,
        })),
      );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private _sinceDate(period: HistoryPeriod): string {
    const date = new Date();
    date.setDate(date.getDate() - period);
    return date.toISOString();
  }
}
