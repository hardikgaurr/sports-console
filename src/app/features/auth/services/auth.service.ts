import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';

import { environment } from '../../../../environment/environment';

import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { AuthStateService } from './auth-state.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly authState = inject(AuthStateService);

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(({ user, token }) => {
        this.tokenStorage.setToken(token);
        this.authState.setUser(user);
      }),
    );
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.baseUrl}/me`).pipe(
      tap((user) => {
        this.authState.setUser(user);
      }),
    );
  }

  restoreSession(): Observable<AuthUser | null> {
    if (!this.hasToken()) {
      return of(null);
    }

    return this.getCurrentUser().pipe(
      catchError(() => {
        this.logout();
        return of(null);
      }),
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.authState.clear();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  hasToken(): boolean {
    return this.tokenStorage.hasToken();
  }
}
