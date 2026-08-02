import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../../environment/environment';

import { Staff, StaffPayload } from '../models/staff.model';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/staff`;

  readonly staff = signal<Staff[]>([]);

  readonly loading = signal(false);

  /**
   * Fetches all staff members for an organisation.
   */
  fetchStaff(organisationId: string): Observable<Staff[]> {
    this.loading.set(true);

    return this.http
      .get<Staff[]>(`${environment.apiUrl}/organisations/${organisationId}/staff`)
      .pipe(
        tap((staff) => {
          this.staff.set(staff);
          this.loading.set(false);
        }),
        catchError((error) => {
          this.loading.set(false);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Fetches a single staff member.
   */
  getStaff(id: string): Observable<Staff> {
    return this.http.get<Staff>(`${this.baseUrl}/${id}`).pipe(
      tap((staffMember) => {
        const staff = this.staff();

        const index = staff.findIndex((item) => item.id === staffMember.id);

        if (index === -1) {
          this.staff.set([...staff, staffMember]);
          return;
        }

        const updated = [...staff];
        updated[index] = staffMember;

        this.staff.set(updated);
      }),
    );
  }

  /**
   * Creates a new staff member.
   */
  addStaff(organisationId: string, payload: StaffPayload): Observable<Staff> {
    return this.http
      .post<Staff>(`${environment.apiUrl}/organisations/${organisationId}/staff`, payload)
      .pipe(
        tap((staffMember) => {
          this.staff.set([...this.staff(), staffMember]);
        }),
      );
  }

  /**
   * Updates a staff member.
   */
  updateStaff(id: string, payload: StaffPayload): Observable<Staff> {
    return this.http.patch<Staff>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updatedStaff) => {
        const updated = this.staff().map((staffMember) =>
          staffMember.id === id ? updatedStaff : staffMember,
        );

        this.staff.set(updated);
      }),
    );
  }

  /**
   * Deletes a staff member.
   */
  deleteStaff(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.staff.set(this.staff().filter((staffMember) => staffMember.id !== id));
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
