import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../model/entities/notification.entity';
import { MarkReadRequest } from '../model/request/mark-read.request';

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private url = `${environment.apiBaseUrl}${environment.notificationsPath}`;

  private http = inject(HttpClient);

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // ── Get all ──────────────────────────────────────────────────────────────────

  getAll(): Observable<Notification[]> {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    return this.http.get<Notification[]>(this.url, this.httpOptions);

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http.get<Notification[]>(this.url, this.httpOptions);
  }

  // ── Get by userId ────────────────────────────────────────────────────────────

  getByUserId(userId: number): Observable<Notification[]> {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    return this.http.get<Notification[]>(`${this.url}?userId=${userId}`, this.httpOptions);

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http.get<Notification[]>(`${this.url}/user/${userId}`, this.httpOptions);
  }

  // ── Mark as read ─────────────────────────────────────────────────────────────

  markAsRead(id: number): Observable<Notification> {
    const body = new MarkReadRequest(false);

    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    return this.http.patch<Notification>(`${this.url}/${id}`, body, this.httpOptions);

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http.patch<Notification>(`${this.url}/${id}/read`, body, this.httpOptions);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
