import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../../environment/environment';

import { Organisation, OrganisationPayload } from '../models/organisation.model';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/organisations`;

  readonly organisations = signal<Organisation[]>([]);

  readonly loading = signal(false);

  /** Fetches all organisations for a governing body and updates local state. */
  fetchOrganisations(governingBodyId: string): Observable<Organisation[]> {
    this.loading.set(true);

    return this.http.get<Organisation[]>(`${this.baseUrl}?governingBodyId=${governingBodyId}`).pipe(
      tap((organisations) => {
        this.organisations.set(organisations);
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      }),
    );
  }

  getOrganisation(id: string): Observable<Organisation> {
    return this.http.get<Organisation>(`${this.baseUrl}/${id}`).pipe(
      tap((organisation) => {
        const organisations = this.organisations();

        const index = organisations.findIndex((item) => item.id === organisation.id);

        if (index === -1) {
          this.organisations.set([...organisations, organisation]);
          return;
        }

        const updated = [...organisations];
        updated[index] = organisation;

        this.organisations.set(updated);
      }),
    );
  }
  addOrganisation(payload: OrganisationPayload): Observable<Organisation> {
    return this.http.post<Organisation>(this.baseUrl, payload).pipe(
      tap((organisation) => {
        this.organisations.set([...this.organisations(), organisation]);
      }),
    );
  }

  updateOrganisation(id: string, payload: OrganisationPayload): Observable<Organisation> {
    return this.http.patch<Organisation>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updatedOrganisation) => {
        const updated = this.organisations().map((organisation) =>
          organisation.id === id ? updatedOrganisation : organisation,
        );

        this.organisations.set(updated);
      }),
    );
  }

  /**
   * Deletes an organisation.
   * Backend returns 409 if it still has participants/staff/squad attached.
   */
  deleteOrganisation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.organisations.set(
          this.organisations().filter((organisation) => organisation.id !== id),
        );
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
