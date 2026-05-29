import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../model/entities/user.entity';
import { BaseService } from '../../shared/services/base.service';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor() {
    super();
    this.resourceEndpoint = environment.usersEndpointPath;
  }

  // ── Role helpers ─────────────────────────────────────────────────────────

  getUserRole(): string | null {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
      return JSON.parse(userData).role ?? null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'USER';
  }

  // ── Current user from localStorage ───────────────────────────────────────

  getCurrentUserId(): number | null {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
      return JSON.parse(userData).id ?? null;
    } catch {
      return null;
    }
  }

  // ── Update profile (firstName, lastName, email, photoUrl) ─────────────────

  updateProfile(id: number, data: Partial<User>): Observable<User> {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    return this.http.patch<User>(
      `${this.resourcePath()}/${id}`,
      JSON.stringify(data),
      this.httpOptions,
    );

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http
    //   .put<User>(`${this.resourcePath()}/${id}/profile`, JSON.stringify(data), this.httpOptions);
  }

  // ── Update password ───────────────────────────────────────────────────────

  updatePassword(id: number, currentPassword: string, newPassword: string): Observable<User> {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    // json-server doesn't validate currentPassword, so we just PATCH the password field
    return this.http.patch<User>(
      `${this.resourcePath()}/${id}`,
      JSON.stringify({ password: newPassword }),
      this.httpOptions,
    );

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http
    //   .put<User>(
    //     `${this.resourcePath()}/${id}/password`,
    //     JSON.stringify({ currentPassword, newPassword }),
    //     this.httpOptions
    //   );
  }

  // ── Delete account ────────────────────────────────────────────────────────

  deleteAccount(id: number): Observable<any> {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    return this.delete(id);

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http
    //   .delete(`${this.resourcePath()}/${id}`, this.httpOptions);
  }

  // ── Sync localStorage after profile update ────────────────────────────────

  syncLocalStorage(updated: Partial<User>): void {
    const raw = localStorage.getItem('userData');
    if (!raw) return;
    try {
      const current = JSON.parse(raw);
      const merged = {
        ...current,
        firstName: updated.firstName ?? current.firstName,
        lastName: updated.lastName ?? current.lastName,
        email: updated.email ?? current.email,
        photoUrl: updated.photoUrl ?? current.photoUrl,
        username:
          updated.firstName && updated.lastName
            ? `${updated.firstName} ${updated.lastName}`
            : current.username,
      };
      localStorage.setItem('userData', JSON.stringify(merged));
    } catch {
      // silent
    }
  }
}
