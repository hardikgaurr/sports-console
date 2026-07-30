import { Injectable, signal } from '@angular/core';

import { AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  readonly user = signal<AuthUser | null>(null);

  setUser(user: AuthUser): void {
    this.user.set(user);
  }

  clear(): void {
    this.user.set(null);
  }

  isAuthenticated(): boolean {
    return this.user() !== null;
  }
}
