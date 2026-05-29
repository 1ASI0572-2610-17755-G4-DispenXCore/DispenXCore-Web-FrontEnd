import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DispenserStatus } from '../../inventory-telemetry/model/entities/dispenser-status.entity';
import { Dispensator } from '../../inventory-telemetry/model/entities/dispensator.entity';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private statusUrl = `${environment.apiBaseUrl}${environment.dispensatorStatusPath}`;
  private dispensatorsUrl = `${environment.apiBaseUrl}${environment.dispensatorsPath}`;

  private http = inject(HttpClient);

  // ── Dispenser status ─────────────────────────────────────────────────────────

  getStatusByDispensator(dispensatorId: number): Observable<DispenserStatus> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http
      .get<DispenserStatus[]>(`${this.statusUrl}?dispensatorId=${dispensatorId}`)
      .pipe(
        // Mapear el plain object a instancia de clase para que los getters funcionen
        map((list) => new DispenserStatus(list[0])),
      );

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<DispenserStatusResponse>(`${this.statusUrl}/${dispensatorId}`)
    //   .pipe(map(r => new DispenserStatus(r.data)));
  }

  // ── Dispensators ─────────────────────────────────────────────────────────────

  getDispensators(): Observable<Dispensator[]> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http
      .get<Dispensator[]>(this.dispensatorsUrl)
      .pipe(map((list) => list.map((d) => new Dispensator(d))));

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<DispensatorListResponse>(this.dispensatorsUrl)
    //   .pipe(map(r => r.data.map(d => new Dispensator(d))));
  }
}
