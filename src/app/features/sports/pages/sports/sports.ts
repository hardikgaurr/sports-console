import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SportsToolbarComponent } from '../../components/sports-toolbar/sports-toolbar';
import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { SportsTableComponent } from '../../components/sports-table/sports-table';

import { SportsService } from '../../services/sport.service';
import { AddEditSportComponent } from '../../dialogs/add-edit-sport/add-edit-sport';
import { Sport } from '../../models/sport.model';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation';

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [MatDialogModule, SportsToolbarComponent, SportsStatsComponent, SportsTableComponent],
  templateUrl: './sports.html',
  styleUrl: './sports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
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
    this.sports().reduce((total, sport) => total + Number(sport.governingBodyCount), 0),
  );

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  openAddSportDialog(): void {
    const dialogRef = this.dialog.open(AddEditSportComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
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

  editSport(sport: Sport): void {
    const dialogRef = this.dialog.open(AddEditSportComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'edit',
        sport,
      },
    });

    dialogRef.afterClosed().subscribe((updatedSport: Sport | undefined) => {
      if (!updatedSport) {
        return;
      }

      this.sportsService.updateSport(updatedSport);
    });
  }

  resetSports(): void {
    const confirmed = window.confirm(
      'Are you sure you want to reset the sports catalogue?\n\nThis will restore the original seed data and remove all local changes.',
    );

    if (!confirmed) {
      return;
    }

    this.sportsService.reset();
  }

  deleteSport(id: string): void {
    const sport = this.sports().find((sport) => sport.id === id);

    if (!sport) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '420px',
      panelClass: 'delete-dialog',
      data: {
        sport,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.sportsService.deleteSport(id);
    });
  }

  viewSport(sport: Sport): void {
    this.router.navigate(['/sports', sport.id]);
  }
}
