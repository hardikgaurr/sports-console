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

import { BreadcrumbItem } from '../../../../common/models/breadcrumb-item.model';
import { BreadcrumbsComponent } from '../../../../common/components/breadcrumbs/breadcrumbs.component';

import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { OrganisationsTableComponent } from '../../components/organisations-table/organisations-table';

import { SportsService } from '../../services/sport.service';
import { GoverningBodyService } from '../../services/governing-body.service';
import { OrganisationService } from '../../services/organisation.service';

import { AddEditOrganisationComponent } from '../../dialogs/add-edit-organisation/add-edit-organisation';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation';

import { Organisation } from '../../models/organisation.model';

import { AuthStateService } from '../../../auth/services/auth-state.service';
import { ButtonComponent } from '../../../../common/components/button/button.component';
@Component({
  selector: 'app-governing-body-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    BreadcrumbsComponent,
    ButtonComponent,
    SportsStatsComponent,
    OrganisationsTableComponent,
  ],
  templateUrl: './governing-body-detail.html',
  styleUrl: './governing-body-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoverningBodyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);

  private readonly sportsService = inject(SportsService);
  private readonly governingBodyService = inject(GoverningBodyService);
  private readonly organisationService = inject(OrganisationService);
  private readonly authState = inject(AuthStateService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';
  readonly governingBodyId = this.route.snapshot.paramMap.get('gbId') ?? '';

  readonly loading = signal(true);

  readonly deleteError = signal<string | null>(null);

  readonly isAdmin = computed(() => this.authState.user()?.role === 'admin');

  readonly sport = computed(() =>
    this.sportsService.sports().find((sport) => sport.id === this.sportId),
  );

  readonly governingBody = computed(() =>
    this.governingBodyService.governingBodies().find((body) => body.id === this.governingBodyId),
  );

  readonly organisations = computed(() =>
    this.organisationService
      .organisations()
      .filter((organisation) => organisation.governingBodyId === this.governingBodyId),
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
    {
      label: this.governingBody()?.name ?? '',
      route: `/sports/${this.sportId}/governing-bodies/${this.governingBodyId}`,
    },
  ]);

  ngOnInit(): void {
    forkJoin([
      this.sportsService.getSport(this.sportId),
      this.governingBodyService.getGoverningBody(this.governingBodyId),
      this.organisationService.fetchOrganisations(this.governingBodyId),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false),
      });
  }

  viewOrganisation(organisation: Organisation): void {
    this.router.navigate([
      '/sports',
      this.sportId,
      'governing-bodies',
      this.governingBodyId,
      'organisations',
      organisation.id,
    ]);
  }

  openAddOrganisationDialog(): void {
    this.dialog.open(AddEditOrganisationComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'add',
        governingBodyId: this.governingBodyId,
      },
    });
  }

  editOrganisation(organisation: Organisation): void {
    this.dialog.open(AddEditOrganisationComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'edit',
        governingBodyId: this.governingBodyId,
        organisation,
      },
    });
  }

  deleteOrganisation(id: string): void {
    const organisation = this.organisations().find((organisation) => organisation.id === id);

    if (!organisation) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '420px',
      panelClass: 'delete-dialog',
      data: {
        title: 'Organisation',
        name: organisation.name,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.deleteError.set(null);

      this.organisationService.deleteOrganisation(id).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.deleteError.set(
              'This organisation still has participants attached. Remove those first.',
            );
          } else {
            this.deleteError.set('Could not delete this organisation. Please try again.');
          }
        },
      });
    });
  }
}
