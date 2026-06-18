import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../model/entities/notification.entity';
import { MarkReadRequest } from '../model/request/mark-read.request';
import { NotificationType } from '../model/entities/notification-type.model';

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private url = `${environment.apiBaseUrl}${environment.notificationsPath}`;

  private http = inject(HttpClient);

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private parseType(value: any): NotificationType {
    const map: Record<number, NotificationType> = {
      0: NotificationType.ALERT,
      1: NotificationType.SUCCESS,
      2: NotificationType.INFO,
    };
    return typeof value === 'number'
      ? (map[value] ?? NotificationType.INFO)
      : (value as NotificationType);
  }
  // ── Get all ──────────────────────────────────────────────────────────────────

  getAll(): Observable<Notification[]> {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    return this.http.get<Notification[]>(this.url, this.httpOptions);

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http.get<Notification[]>(this.url, this.httpOptions);
  }

  // ── Get by userId ────────────────────────────────────────────────────────────

  getByUserId(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}?userId=${userId}`, this.httpOptions).pipe(
      map((list) =>
        list.map((n) => ({
          ...n,
          type: this.parseType(n.type),
        })),
      ),
    );
  }

  // ── Mark as read ─────────────────────────────────────────────────────────────

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.url}/${id}/read`, {}, this.httpOptions);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
