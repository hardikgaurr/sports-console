import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { BreadcrumbsComponent } from '../../../../common/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItem } from '../../../../common/models/breadcrumb-item.model';

import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { GoverningBodiesTableComponent } from '../../components/governing-bodies-table/governing-bodies-table';

import { SportsService } from '../../services/sport.service';
import { GoverningBodyService } from '../../services/governing-body.service';

import { AddEditGoverningBodyComponent } from '../../dialogs/add-edit-governing-body/add-edit-governing-body';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation';

import { GoverningBody } from '../../models/governing-body.model';

import { AuthStateService } from '../../../auth/services/auth-state.service';

@Component({
  selector: 'app-sport-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    BreadcrumbsComponent,
    SportsStatsComponent,
    GoverningBodiesTableComponent,
  ],
  templateUrl: './sport-detail.html',
  styleUrl: './sport-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);

  private readonly sportsService = inject(SportsService);
  private readonly governingBodyService = inject(GoverningBodyService);
  private readonly authState = inject(AuthStateService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';

  readonly loading = signal(true);

  readonly deleteError = signal<string | null>(null);

  readonly isAdmin = computed(() => this.authState.user()?.role === 'admin');

  readonly sport = computed(() =>
    this.sportsService.sports().find((sport) => sport.id === this.sportId),
  );

  readonly governingBodies = computed(() =>
    this.governingBodyService.governingBodies().filter((body) => body.sportId === this.sportId),
  );

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    {
      label: 'Sports',
      route: '/sports',
    },
    {
      label: this.sport()?.name ?? '',
      route: `/sports/${this.sportId}`,
    },
  ]);

  ngOnInit(): void {
    forkJoin([
      this.sportsService.getSport(this.sportId),
      this.governingBodyService.fetchGoverningBodies(this.sportId),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false),
      });
  }

  viewGoverningBody(body: GoverningBody): void {
    this.router.navigate(['/sports', this.sportId, 'governing-bodies', body.id]);
  }

  openAddGoverningBodyDialog(): void {
    const dialogRef = this.dialog.open(AddEditGoverningBodyComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'add',
        sportId: this.sportId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.governingBodyService.fetchGoverningBodies(this.sportId).subscribe();
      }
    });
  }

  editGoverningBody(body: GoverningBody): void {
    const dialogRef = this.dialog.open(AddEditGoverningBodyComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'edit',
        sportId: this.sportId,
        governingBody: body,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.governingBodyService.fetchGoverningBodies(this.sportId).subscribe();
      }
    });
  }

  deleteGoverningBody(id: string): void {
    const governingBody = this.governingBodies().find((body) => body.id === id);

    if (!governingBody) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '420px',
      panelClass: 'delete-dialog',
      data: {
        title: 'Governing Body',
        name: governingBody.name,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.deleteError.set(null);

      this.governingBodyService.deleteGoverningBody(id).subscribe({
        next: () => {
          this.governingBodyService.fetchGoverningBodies(this.sportId).subscribe();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.deleteError.set(
              'This governing body still has organisations attached. Remove those first.',
            );
          } else {
            this.deleteError.set('Could not delete this governing body. Please try again.');
          }
        },
      });
    });
  }
}
