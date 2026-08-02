import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

import { environment } from '../../../../environment/environment';

import { AppUser, SquadMember, SquadMemberPayload } from '../models/squad.model';

@Injectable({
  providedIn: 'root',
})
export class SquadService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/squad`;

  readonly squad = signal<SquadMember[]>([]);

  readonly users = signal<AppUser[]>([]);

  readonly loading = signal(false);

  /**
   * Fetches all squad members for an organisation.
   */
  fetchSquad(organisationId: string): Observable<SquadMember[]> {
    this.loading.set(true);

    return this.http
      .get<SquadMember[]>(`${environment.apiUrl}/organisations/${organisationId}/squad`)
      .pipe(
        tap((members) => {
          this.squad.set(members);
          this.loading.set(false);
        }),
        catchError((error) => {
          this.loading.set(false);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Fetches a single squad member.
   */
  getSquadMember(id: string): Observable<SquadMember> {
    return this.http.get<SquadMember>(`${this.baseUrl}/${id}`).pipe(
      tap((member) => {
        const squad = this.squad();

        const index = squad.findIndex((item) => item.id === member.id);

        if (index === -1) {
          this.squad.set([...squad, member]);
          return;
        }

        const updated = [...squad];
        updated[index] = member;

        this.squad.set(updated);
      }),
    );
  }

  /**
   * Creates a squad member.
   */
  addSquadMember(organisationId: string, payload: SquadMemberPayload): Observable<SquadMember> {
    return this.http
      .post<SquadMember>(`${environment.apiUrl}/organisations/${organisationId}/squad`, payload)
      .pipe(
        tap((member) => {
          this.squad.set([...this.squad(), member]);
        }),
      );
  }

  /**
   * Updates a squad member.
   */
  updateSquadMember(id: string, payload: SquadMemberPayload): Observable<SquadMember> {
    return this.http.patch<SquadMember>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updatedMember) => {
        const updated = this.squad().map((member) => (member.id === id ? updatedMember : member));

        this.squad.set(updated);
      }),
    );
  }

  /**
   * Deletes a squad member.
   */
  deleteSquadMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.squad.set(this.squad().filter((member) => member.id !== id));
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  /**
   * Fetches users once and filters client-side.
   */
  searchUsers(query = ''): Observable<AppUser[]> {
    const filterUsers = (users: AppUser[]): AppUser[] => {
      const search = query.trim().toLowerCase();

      if (!search) {
        return users;
      }

      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search),
      );
    };

    if (this.users().length > 0) {
      return of(filterUsers(this.users()));
    }

    return this.http.get<AppUser[]>(`${environment.apiUrl}/users`).pipe(
      tap((users) => {
        this.users.set(users);
      }),
      map((users) => filterUsers(users)),
    );
  }
}
