import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { SportsToolbarComponent } from '../../components/sports-toolbar/sports-toolbar';
import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { SportsTableComponent } from '../../components/sports-table/sports-table';

import { SportsService } from '../../services/sport.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';
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
export class SportsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly sportsService = inject(SportsService);
  private readonly authState = inject(AuthStateService);

  readonly sports = this.sportsService.sports;
  readonly loading = this.sportsService.loading;

  readonly isAdmin = computed(() => this.authState.user()?.role === 'admin');

  readonly searchQuery = signal('');
  readonly deleteError = signal<string | null>(null);

  readonly filteredSports = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.sports();
    }

    return this.sports().filter((sport) => sport.name.toLowerCase().includes(query));
  });

  readonly totalSports = computed(() => this.sports().length);

  ngOnInit(): void {
    this.sportsService.fetchSports().subscribe();
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  openAddSportDialog(): void {
    this.dialog.open(AddEditSportComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: { mode: 'add' },
    });
  }

  editSport(sport: Sport): void {
    this.dialog.open(AddEditSportComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: { mode: 'edit', sport },
    });
  }

  deleteSport(id: string): void {
    const sport = this.sports().find((sport) => sport.id === id);

    if (!sport) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '420px',
      panelClass: 'delete-dialog',
      data: { sport },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.deleteError.set(null);

      this.sportsService.deleteSport(id).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.deleteError.set(
              'This sport still has governing bodies attached. Remove those first.',
            );
          } else {
            this.deleteError.set('Could not delete this sport. Please try again.');
          }
        },
      });
    });
  }
}
