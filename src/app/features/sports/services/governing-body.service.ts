import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { GoverningBody, GoverningBodyPayload } from '../models/governing-body.model';

@Injectable({
  providedIn: 'root',
})
export class GoverningBodyService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/governing-bodies`;

  readonly governingBodies = signal<GoverningBody[]>([]);

  readonly loading = signal(false);

  /** Fetches all governing bodies for a sport and updates local state. */
  fetchGoverningBodies(sportId: string): Observable<GoverningBody[]> {
    this.loading.set(true);

    return this.http.get<GoverningBody[]>(`${this.baseUrl}?sportId=${sportId}`).pipe(
      tap((governingBodies) => {
        this.governingBodies.set(governingBodies);
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      }),
    );
  }

  /** Fetches a single governing body and upserts it into local state. */
  getGoverningBody(id: string): Observable<GoverningBody> {
    return this.http.get<GoverningBody>(`${this.baseUrl}/${id}`).pipe(
      tap((governingBody) => {
        const governingBodies = this.governingBodies();

        const index = governingBodies.findIndex((item) => item.id === governingBody.id);

        if (index === -1) {
          this.governingBodies.set([...governingBodies, governingBody]);
          return;
        }

        const updated = [...governingBodies];
        updated[index] = governingBody;

        this.governingBodies.set(updated);
      }),
    );
  }

  addGoverningBody(payload: GoverningBodyPayload): Observable<GoverningBody> {
    return this.http.post<GoverningBody>(this.baseUrl, payload).pipe(
      tap((governingBody) => {
        this.governingBodies.set([...this.governingBodies(), governingBody]);
      }),
    );
  }

  updateGoverningBody(id: string, payload: GoverningBodyPayload): Observable<GoverningBody> {
    return this.http.patch<GoverningBody>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updatedGoverningBody) => {
        const updated = this.governingBodies().map((governingBody) =>
          governingBody.id === id ? updatedGoverningBody : governingBody,
        );

        this.governingBodies.set(updated);
      }),
    );
  }

  /**
   * Deletes a governing body. Backend returns 409 if it still has
   * organisations attached — callers should catch that and show
   * a friendly message.
   */
  deleteGoverningBody(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.governingBodies.set(
          this.governingBodies().filter((governingBody) => governingBody.id !== id),
        );
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
