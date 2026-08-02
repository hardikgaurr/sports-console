import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../../environment/environment';

import { Participant, ParticipantPayload } from '../models/participant.model';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/participants`;

  readonly participants = signal<Participant[]>([]);

  readonly loading = signal(false);

  /** Fetches all participants for an organisation and updates local state. */
  fetchParticipants(organisationId: string): Observable<Participant[]> {
    this.loading.set(true);

    return this.http.get<Participant[]>(`${this.baseUrl}?organisationId=${organisationId}`).pipe(
      tap((participants) => {
        this.participants.set(participants);
        this.loading.set(false);
      }),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      }),
    );
  }
  getParticipant(id: string): Observable<Participant> {
    return this.http.get<Participant>(`${this.baseUrl}/${id}`).pipe(
      tap((participant) => {
        const participants = this.participants();

        const index = participants.findIndex((item) => item.id === participant.id);

        if (index === -1) {
          this.participants.set([...participants, participant]);
          return;
        }

        const updated = [...participants];
        updated[index] = participant;

        this.participants.set(updated);
      }),
    );
  }
  addParticipant(payload: ParticipantPayload): Observable<Participant> {
    return this.http.post<Participant>(this.baseUrl, payload).pipe(
      tap((participant) => {
        this.participants.set([...this.participants(), participant]);
      }),
    );
  }

  updateParticipant(id: string, payload: ParticipantPayload): Observable<Participant> {
    return this.http.patch<Participant>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updatedParticipant) => {
        const updated = this.participants().map((participant) =>
          participant.id === id ? updatedParticipant : participant,
        );

        this.participants.set(updated);
      }),
    );
  }

  /**
   * Deletes a participant.
   */
  deleteParticipant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.participants.set(this.participants().filter((participant) => participant.id !== id));
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
