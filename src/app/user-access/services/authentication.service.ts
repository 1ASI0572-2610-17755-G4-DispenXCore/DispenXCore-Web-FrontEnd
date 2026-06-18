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
    this.http.post<any>(this.signInUrl, signInRequest, this.httpOptions).subscribe({
      next: (response) => {
        // El backend devuelve { token, user: { id, firstName, ... } }
        const authResponse: AuthenticationResponse = {
          token: response.token,
          username: `${response.user.firstName} ${response.user.lastName}`,
          role: response.user.role,
        };
        this._handleSignInSuccess(authResponse, response.user);
      },
      error: (error) => {
        console.error('Sign-in error:', error);
        this._clearSession();
        this.translate.get('sign-in.error').subscribe((msg) => this.notification.showError(msg));
        this.router.navigate(['/sign-in']).then();
      },
    });
  }

  // ── Sign Up ─────────────────────────────────────────────────────────────────

  signUp(signUpRequest: SignUpRequest): Observable<AuthenticationResponse> {
    return this.http.post<any>(this.signUpUrl, signUpRequest, this.httpOptions).pipe(
      map(
        () => new AuthenticationResponse('', '', ''), // el register solo devuelve { message }
      ),
    );
  }

  // ── Sign Out ────────────────────────────────────────────────────────────────

  signOut(): void {
    this._clearSession();
    this.router.navigate(['/sign-in']).then();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  // Cambia la firma para recibir el user completo del mock
  private _handleSignInSuccess(response: AuthenticationResponse, user?: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        id: user?.id ?? null,
        firstName: user?.firstName ?? response.username,
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
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
