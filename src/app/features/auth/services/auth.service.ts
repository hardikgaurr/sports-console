import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environment/environment';

import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => {
        this.tokenStorage.setToken(response.token);
      }),
    );
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.baseUrl}/me`);
  }

  logout(): void {
    this.tokenStorage.clear();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  isAuthenticated(): boolean {
    return this.tokenStorage.hasToken();
  }
}
