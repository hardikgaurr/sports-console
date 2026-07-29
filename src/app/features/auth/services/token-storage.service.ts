import { Injectable } from '@angular/core';

import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.constants';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }

  clear(): void {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}
