import { Injectable } from '@angular/core';

import { Sport } from '../models/sport.model';
import { SPORTS_SEED } from '../constants/sports.seed';

@Injectable({
  providedIn: 'root',
})
export class SportsStorageService {
  private readonly storageKey = 'sports-data';

  load(): Sport[] {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      this.save(SPORTS_SEED);
      return [...SPORTS_SEED];
    }

    try {
      return JSON.parse(stored) as Sport[];
    } catch {
      this.save(SPORTS_SEED);
      return [...SPORTS_SEED];
    }
  }

  save(sports: Sport[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(sports));
  }

  reset(): Sport[] {
    this.save(SPORTS_SEED);
    return [...SPORTS_SEED];
  }
}
