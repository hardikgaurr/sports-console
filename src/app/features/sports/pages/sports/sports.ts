import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { SportsService } from '../../services/sport.service';

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [],
  templateUrl: './sports.html',
  styleUrl: './sports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsComponent {
  private readonly sportsService = inject(SportsService);

  readonly sports = this.sportsService.sports;

  readonly searchQuery = signal('');

  readonly filteredSports = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.sports();
    }

    return this.sports().filter(
      (sport) =>
        sport.name.toLowerCase().includes(query) || sport.description.toLowerCase().includes(query),
    );
  });

  readonly totalSports = computed(() => this.sports().length);

  readonly totalGoverningBodies = computed(() =>
    this.sports().reduce((total, sport) => total + sport.governingBodyCount, 0),
  );

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }
}
