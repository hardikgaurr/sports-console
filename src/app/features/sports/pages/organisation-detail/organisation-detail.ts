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
import { ParticipantsTableComponent } from '../../components/participants-table/participants-table';

import { SportsService } from '../../services/sport.service';
import { GoverningBodyService } from '../../services/governing-body.service';
import { OrganisationService } from '../../services/organisation.service';
import { ParticipantService } from '../../services/participant.service';

import { AddEditParticipantComponent } from '../../dialogs/add-edit-participant/add-edit-participant';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation';

import { Participant } from '../../models/participant.model';

import { AuthStateService } from '../../../auth/services/auth-state.service';

@Component({
  selector: 'app-organisation-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    BreadcrumbsComponent,
    SportsStatsComponent,
    ParticipantsTableComponent,
  ],
  templateUrl: './organisation-detail.html',
  styleUrl: './organisation-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);

  private readonly sportsService = inject(SportsService);
  private readonly governingBodyService = inject(GoverningBodyService);
  private readonly organisationService = inject(OrganisationService);
  private readonly participantService = inject(ParticipantService);
  private readonly authState = inject(AuthStateService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';
  readonly governingBodyId = this.route.snapshot.paramMap.get('gbId') ?? '';
  readonly organisationId = this.route.snapshot.paramMap.get('orgId') ?? '';

  readonly loading = signal(true);

  readonly deleteError = signal<string | null>(null);

  readonly isAdmin = computed(() => this.authState.user()?.role === 'admin');

  readonly sport = computed(() =>
    this.sportsService.sports().find((sport) => sport.id === this.sportId),
  );

  readonly governingBody = computed(() =>
    this.governingBodyService.governingBodies().find((body) => body.id === this.governingBodyId),
  );

  readonly organisation = computed(() =>
    this.organisationService.organisations().find((org) => org.id === this.organisationId),
  );

  readonly participants = computed(() =>
    this.participantService
      .participants()
      .filter((participant) => participant.organisationId === this.organisationId),
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
    {
      label: this.organisation()?.name ?? '',
      route: `/sports/${this.sportId}/governing-bodies/${this.governingBodyId}/organisations/${this.organisationId}`,
    },
  ]);

  ngOnInit(): void {
    forkJoin([
      this.sportsService.getSport(this.sportId),
      this.governingBodyService.getGoverningBody(this.governingBodyId),
      this.organisationService.getOrganisation(this.organisationId),
      this.participantService.fetchParticipants(this.organisationId),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false),
      });
  }

  viewParticipant(participant: Participant): void {
    this.router.navigate([
      '/sports',
      this.sportId,
      'governing-bodies',
      this.governingBodyId,
      'organisations',
      this.organisationId,
      'participants',
      participant.id,
    ]);
  }

  openAddParticipantDialog(): void {
    this.dialog.open(AddEditParticipantComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'add',
        organisationId: this.organisationId,
      },
    });
  }

  editParticipant(participant: Participant): void {
    this.dialog.open(AddEditParticipantComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'edit',
        organisationId: this.organisationId,
        participant,
      },
    });
  }

  deleteParticipant(id: string): void {
    const participant = this.participants().find((participant) => participant.id === id);

    if (!participant) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '420px',
      panelClass: 'delete-dialog',
      data: {
        title: 'Participant',
        name: participant.name,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.deleteError.set(null);

      this.participantService.deleteParticipant(id).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.deleteError.set('Could not delete this participant.');
          } else {
            this.deleteError.set('Something went wrong. Please try again.');
          }
        },
      });
    });
  }
}
