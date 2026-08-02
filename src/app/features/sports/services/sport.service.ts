import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { Sport, SportPayload } from '../models/sport.model';

@Injectable({
  providedIn: 'root',
})
export class SportsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sports`;

  readonly sports = signal<Sport[]>([]);
  readonly loading = signal(false);

  /** Fetches all sports from the API and updates local state. */
  fetchSports(): Observable<Sport[]> {
    this.loading.set(true);

    return this.http.get<Sport[]>(this.baseUrl).pipe(
      tap((sports) => {
        this.sports.set(sports);
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      }),
    );
  }
  getSport(id: string): Observable<Sport> {
    return this.http.get<Sport>(`${this.baseUrl}/${id}`).pipe(
      tap((sport) => {
        const sports = this.sports();
        const index = sports.findIndex((item) => item.id === sport.id);

        if (index === -1) {
          this.sports.set([...sports, sport]);
          return;
        }

        const updated = [...sports];
        updated[index] = sport;

        this.sports.set(updated);
      }),
    );
  }
  addSport(payload: SportPayload): Observable<Sport> {
    return this.http.post<Sport>(this.baseUrl, payload).pipe(
      tap((sport) => {
        this.sports.set([...this.sports(), sport]);
      }),
    );
  }

  updateSport(id: string, payload: SportPayload): Observable<Sport> {
    return this.http.patch<Sport>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updatedSport) => {
        const updated = this.sports().map((sport) => (sport.id === id ? updatedSport : sport));
        this.sports.set(updated);
      }),
    );
  }

  /**
   * Deletes a sport. Backend returns 409 if the sport still has governing
   * bodies attached — callers should catch that and show a friendly message.
   */
  deleteSport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.sports.set(this.sports().filter((sport) => sport.id !== id));
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
