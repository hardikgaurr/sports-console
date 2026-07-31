import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Sport } from '../models/sport.model';
import { SportsStorageService } from '../services/sport-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SportsService {
  readonly sports = signal<Sport[]>([]);

  constructor(private readonly storageService: SportsStorageService) {
    this.sports.set(this.storageService.load());
  }

  getSports(): Observable<Sport[]> {
    return of(this.sports());
  }

  addSport(sport: Sport): void {
    const updated = [...this.sports(), sport];
    this.updateState(updated);
  }

  updateSport(updatedSport: Sport): void {
    const updated = this.sports().map((sport) =>
      sport.id === updatedSport.id ? updatedSport : sport,
    );

    this.updateState(updated);
  }

  deleteSport(id: string): void {
    const updated = this.sports().filter((sport) => sport.id !== id);
    this.updateState(updated);
  }

  reset(): void {
    this.sports.set(this.storageService.reset());
  }

  private updateState(sports: Sport[]): void {
    this.sports.set(sports);
    this.storageService.save(sports);
  }
}
