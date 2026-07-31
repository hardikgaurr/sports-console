import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { SportsService } from '../../services/sport.service';
import { AddEditSportComponent } from '../../dialogs/add-edit-sport';
import { Sport } from '../../models/sport.model';

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './sports.html',
  styleUrl: './sports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsComponent {
  private readonly dialog = inject(MatDialog);
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

  openAddSportDialog(): void {
    const dialogRef = this.dialog.open(AddEditSportComponent, {
      width: '500px',
      data: {
        mode: 'add',
      },
    });

    dialogRef.afterClosed().subscribe((sport: Sport | undefined) => {
      if (!sport) {
        return;
      }

      this.sportsService.addSport(sport);
    });
  }
}
