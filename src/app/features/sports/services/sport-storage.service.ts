import { Injectable } from '@angular/core';

import { SPORTS_SEED } from '../constants/sports.seed';
import { GOVERNING_BODIES_SEED } from '../constants/governing-bodies.seed';
import { ORGANISATIONS_SEED } from '../constants/organisations.seed';
import { PARTICIPANTS_SEED } from '../constants/participants.seed';

import { SportsCatalogue } from '../models/sports-catalogue.model';

@Injectable({
  providedIn: 'root',
})
export class SportsStorageService {
  private readonly storageKey = 'sports-catalogue';

  load(): SportsCatalogue {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      const catalogue = this.createSeedCatalogue();

      this.save(catalogue);

      return catalogue;
    }

    try {
      return JSON.parse(stored) as SportsCatalogue;
    } catch {
      const catalogue = this.createSeedCatalogue();

      this.save(catalogue);

      return catalogue;
    }
  }

  save(catalogue: SportsCatalogue): void {
    localStorage.setItem(this.storageKey, JSON.stringify(catalogue));
  }

  reset(): SportsCatalogue {
    const catalogue = this.createSeedCatalogue();

    this.save(catalogue);

    return catalogue;
  }

  private createSeedCatalogue(): SportsCatalogue {
    return {
      sports: [...SPORTS_SEED],
      governingBodies: [...GOVERNING_BODIES_SEED],
      organisations: [...ORGANISATIONS_SEED],
      participants: [...PARTICIPANTS_SEED],
    };
  }
}
