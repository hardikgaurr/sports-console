import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Sport } from '../models/sport.model';
import { GoverningBody } from '../models/governing-body.model';
import { Organisation } from '../models/organisation.model';
import { Participant } from '../models/participant.model';
import { SportsCatalogue } from '../models/sports-catalogue.model';

import { SportsStorageService } from './sport-storage.service';
@Injectable({
  providedIn: 'root',
})
export class SportsService {
  readonly catalogue = signal<SportsCatalogue>({
    sports: [],
    governingBodies: [],
    organisations: [],
    participants: [],
  });

  readonly sports = signal<Sport[]>([]);

  readonly governingBodies = signal<GoverningBody[]>([]);

  readonly organisations = signal<Organisation[]>([]);

  readonly participants = signal<Participant[]>([]);

  constructor(private readonly storageService: SportsStorageService) {
    const catalogue = this.storageService.load();

    this.updateSignals(catalogue);
  }
  getSports(): Observable<Sport[]> {
    return of(this.sports());
  }

  addSport(sport: Sport): void {
    const sports = [...this.sports(), sport];

    this.updateCatalogue({
      ...this.catalogue(),
      sports,
    });
  }

  updateSport(updatedSport: Sport): void {
    const sports = this.sports().map((sport) =>
      sport.id === updatedSport.id ? updatedSport : sport,
    );

    this.updateCatalogue({
      ...this.catalogue(),
      sports,
    });
  }

  deleteSport(id: string): void {
    const sports = this.sports().filter((sport) => sport.id !== id);

    this.updateCatalogue({
      ...this.catalogue(),
      sports,
    });
  }

  reset(): void {
    const catalogue = this.storageService.reset();

    this.updateSignals(catalogue);
  }

  private updateCatalogue(catalogue: SportsCatalogue): void {
    this.storageService.save(catalogue);

    this.updateSignals(catalogue);
  }

  private updateSignals(catalogue: SportsCatalogue): void {
    this.catalogue.set(catalogue);

    this.sports.set(catalogue.sports);

    this.governingBodies.set(catalogue.governingBodies);

    this.organisations.set(catalogue.organisations);

    this.participants.set(catalogue.participants);
  }
}
