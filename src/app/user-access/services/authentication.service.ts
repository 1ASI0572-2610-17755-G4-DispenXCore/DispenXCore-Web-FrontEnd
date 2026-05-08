import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { SignUpRequest } from '../model/request/sign-up.request';
import { SignInRequest } from '../model/request/sign-in.request';
import { AuthenticationResponse } from '../model/response/authentication.response';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class Authentication {
  private signInUrl = `${environment.apiBaseUrl}${environment.signInPath}`;
  private signUpUrl = `${environment.apiBaseUrl}${environment.signUpPath}`;

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  private signedIn = new BehaviorSubject<boolean>(false);
  private signedInUsername = new BehaviorSubject<string>('');
  private signedInRole = new BehaviorSubject<string>('');

  private notification = inject(NotificationService);
  private translate = inject(TranslateService);

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      const parsed = JSON.parse(userData);
      this.signedIn.next(true);
      this.signedInUsername.next(parsed.username ?? '');
      this.signedInRole.next(parsed.role ?? '');
    }
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }
  get currentUsername() {
    return this.signedInUsername.asObservable();
  }
  get currentRole() {
    return this.signedInRole.asObservable();
  }

  // ── Sign In ─────────────────────────────────────────────────────────────────

  signIn(signInRequest: SignInRequest): void {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    this.http.get<any[]>(`${this.signInUrl}`, this.httpOptions).subscribe({
      next: (users) => {
        const user = users.find(
          (u) => u.email === signInRequest.email && u.password === signInRequest.password,
        );

        if (!user) {
          this.translate.get('sign-in.error').subscribe((msg) => this.notification.showError(msg));
          return;
        }

        const response: AuthenticationResponse = {
          token: btoa(`${user.email}:${user.role}:${Date.now()}`),
          username: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };

        this._handleSignInSuccess(response);
      },
      error: (error) => {
        console.error('Sign-in error:', error);
        this._clearSession();
        this.translate.get('sign-in.error').subscribe((msg) => this.notification.showError(msg));
        this.router.navigate(['/sign-in']).then();
      },
    });

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // this.http
    //   .post<AuthenticationResponse>(this.signInUrl, signInRequest, this.httpOptions)
    //   .subscribe({
    //     next: (response) => this._handleSignInSuccess(response),
    //     error: (error) => {
    //       console.error('Sign-in error:', error);
    //       this._clearSession();
    //       this.translate.get('sign-in.error').subscribe((msg) => this.notification.showError(msg));
    //       this.router.navigate(['/sign-in']).then();
    //     },
    //   });
  }

  // ── Sign Up ─────────────────────────────────────────────────────────────────

  signUp(signUpRequest: SignUpRequest): Observable<AuthenticationResponse> {
    // ── JSON-SERVER (mock) ──────────────────────────────────────────────────
    const newUser = { ...signUpRequest, role: 'USER', status: 'ACTIVE' };
    return this.http
      .post<any>(this.signUpUrl, newUser, this.httpOptions)
      .pipe(
        map(
          (user) =>
            new AuthenticationResponse(
              btoa(`${user.email}:${user.role}:${Date.now()}`),
              `${user.firstName} ${user.lastName}`,
              user.role,
            ),
        ),
      );

    // ── REAL BACKEND ────────────────────────────────────────────────────────
    // return this.http.post<AuthenticationResponse>(this.signUpUrl, signUpRequest, this.httpOptions);
  }

  // ── Sign Out ────────────────────────────────────────────────────────────────

  signOut(): void {
    this._clearSession();
    this.router.navigate(['/sign-in']).then();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private _handleSignInSuccess(response: AuthenticationResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        username: response.username,
        role: response.role,
      }),
    );
    this.signedIn.next(true);
    this.signedInUsername.next(response.username);
    this.signedInRole.next(response.role);

    this.translate.get('sign-in.success').subscribe((msg) => this.notification.showSuccess(msg));

    switch (response.role) {
      case 'ADMIN':
        this.router.navigate(['/dashboard']).then();
        break;
      case 'USER':
        this.router.navigate(['/dashboard']).then();
        break;
      default:
        this.translate
          .get('sign-in.no-permission')
          .subscribe((msg) => this.notification.showError(msg));
        this.router.navigate(['/sign-in']).then();
    }
  }

  private _clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.signedIn.next(false);
    this.signedInUsername.next('');
    this.signedInRole.next('');
  }
}
