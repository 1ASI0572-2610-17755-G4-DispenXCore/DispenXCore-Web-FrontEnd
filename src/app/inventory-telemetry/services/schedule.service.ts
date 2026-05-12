import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Schedule } from '../model/entities/schedule.entity';
import { UpdateScheduleRequest } from '../model/request/update-schedule.request';
import { NotificationService } from '../../shared/services/notification.service';
import { CreateScheduleRequest } from '../model/request/create-schedule.request.ts';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private baseUrl = `${environment.apiBaseUrl}${environment.schedulesPath}`;

  private http = inject(HttpClient);
  private notification = inject(NotificationService);

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  // ── Get all by dispensator ──────────────────────────────────────────────────

  getByDispensator(dispensatorId: number): Observable<Schedule[]> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.get<Schedule[]>(`${this.baseUrl}?dispensatorId=${dispensatorId}`);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<ScheduleListResponse>(`${this.baseUrl}?dispensatorId=${dispensatorId}`)
    //   .pipe(map(r => r.data));
  }

  // ── Get one ─────────────────────────────────────────────────────────────────

  getById(id: number): Observable<Schedule> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.get<Schedule>(`${this.baseUrl}/${id}`);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<ScheduleResponse>(`${this.baseUrl}/${id}`)
    //   .pipe(map(r => r.data));
  }

  // ── Create ──────────────────────────────────────────────────────────────────

  create(request: CreateScheduleRequest): Observable<Schedule> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.post<Schedule>(this.baseUrl, request, this.httpOptions);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .post<ScheduleResponse>(this.baseUrl, request, this.httpOptions)
    //   .pipe(map(r => r.data));
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  update(id: number, request: UpdateScheduleRequest): Observable<Schedule> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.put<Schedule>(`${this.baseUrl}/${id}`, request, this.httpOptions);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .put<ScheduleResponse>(`${this.baseUrl}/${id}`, request, this.httpOptions)
    //   .pipe(map(r => r.data));
  }

  // ── Toggle active ───────────────────────────────────────────────────────────

  toggleActive(id: number, isActive: boolean): Observable<Schedule> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.patch<Schedule>(`${this.baseUrl}/${id}`, { isActive }, this.httpOptions);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .patch<ScheduleResponse>(`${this.baseUrl}/${id}`, { isActive }, this.httpOptions)
    //   .pipe(map(r => r.data));
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }
}
