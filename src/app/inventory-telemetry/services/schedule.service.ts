import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Schedule } from '../model/entities/schedule.entity';
import { UpdateScheduleRequest } from '../model/request/update-schedule.request';
import { NotificationService } from '../../shared/services/notification.service';
import { CreateScheduleRequest } from '../model/request/create-schedule.request';
import { SupplyType } from '../model/entities/supply-type.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private baseUrl = `${environment.apiBaseUrl}${environment.schedulesPath}`;

  private http = inject(HttpClient);
  private notification = inject(NotificationService);

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  // ── Get all by dispensator ──────────────────────────────────────────────────

  private parseFrequencyDays(value: any): number[] {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.days)) return value.days; // ← este es tu caso
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  }
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

  getByDispensator(dispensatorId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.baseUrl}?dispensatorId=${dispensatorId}`).pipe(
      map((schedules) =>
        schedules.map((s) => ({
          ...s,
          frequencyDays: this.parseFrequencyDays(s.frequencyDays),
          supplyType: this.parseSupplyType(s.supplyType),
        })),
      ),
    );
  }

  // ── Get one ─────────────────────────────────────────────────────────────────

  getById(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.baseUrl}/${id}`).pipe(
      map((s) => ({
        ...s,
        frequencyDays: this.parseFrequencyDays(s.frequencyDays),
        supplyType: this.parseSupplyType(s.supplyType),
      })),
    );
  }

  // ── Create ──────────────────────────────────────────────────────────────────

  create(request: CreateScheduleRequest): Observable<Schedule> {
    return this.http.post<Schedule>(this.baseUrl, request, this.httpOptions);
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  update(id: number, request: UpdateScheduleRequest): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.baseUrl}/${id}`, request, this.httpOptions);
  }

  // ── Toggle active ───────────────────────────────────────────────────────────

  toggleActive(id: number, isActive: boolean): Observable<Schedule> {
    return this.http.patch<Schedule>(
      `${this.baseUrl}/${id}/toggle`,
      { isActive },
      this.httpOptions,
    );
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }
}
