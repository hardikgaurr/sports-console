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
import { StaffTableComponent } from '../../components/staff-table/staff-table';
import { SquadTableComponent } from '../../components/squad-table/squad-table';

import { StaffService } from '../../services/staff.service';
import { SquadService } from '../../services/squad.service';

import { AddEditStaffComponent } from '../../dialogs/add-edit-staff/add-edit-staff';
import { AddEditSquadMemberComponent } from '../../dialogs/add-edit-squad-member/add-edit-squad-member';

import { Staff } from '../../models/staff.model';
import { SquadMember } from '../../models/squad.model';

@Component({
  selector: 'app-organisation-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    BreadcrumbsComponent,
    SportsStatsComponent,
    ParticipantsTableComponent,
    StaffTableComponent,
    SquadTableComponent,
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
  private readonly staffService = inject(StaffService);
  private readonly squadService = inject(SquadService);

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

  readonly staff = computed(() =>
    this.staffService.staff().filter((member) => member.organisationId === this.organisationId),
  );

  readonly squad = computed(() =>
    this.squadService.squad().filter((member) => member.organisationId === this.organisationId),
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
      this.staffService.fetchStaff(this.organisationId),
      this.squadService.fetchSquad(this.organisationId),
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

  openAddStaffDialog(): void {
    this.dialog.open(AddEditStaffComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'add',
        organisationId: this.organisationId,
      },
    });
  }

  editStaff(staff: Staff): void {
    this.dialog.open(AddEditStaffComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'edit',
        organisationId: this.organisationId,
        staff,
      },
    });
  }

  deleteStaff(id: string): void {
    const staff = this.staff().find((member) => member.id === id);

    if (!staff) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '420px',
      panelClass: 'delete-dialog',
      data: {
        title: 'Staff Member',
        name: staff.name,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.deleteError.set(null);

      this.staffService.deleteStaff(id).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.deleteError.set(
              'This staff member cannot be deleted because it is still referenced.',
            );
          } else {
            this.deleteError.set('Something went wrong. Please try again.');
          }
        },
      });
    });
  }

  openAddSquadMemberDialog(): void {
    this.dialog.open(AddEditSquadMemberComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'add',
        organisationId: this.organisationId,
      },
    });
  }

  editSquadMember(member: SquadMember): void {
    this.dialog.open(AddEditSquadMemberComponent, {
      width: '620px',
      panelClass: 'add-edit-dialog',
      data: {
        mode: 'edit',
        organisationId: this.organisationId,
        squadMember: member,
      },
    });
  }

  deleteSquadMember(id: string): void {
    const member = this.squad().find((item) => item.id === id);

    if (!member) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '420px',
      panelClass: 'delete-dialog',
      data: {
        title: 'Squad Member',
        name: member.displayName,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.deleteError.set(null);

      this.squadService.deleteSquadMember(id).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.deleteError.set(
              'This squad member cannot be deleted because it is still referenced.',
            );
          } else {
            this.deleteError.set('Something went wrong. Please try again.');
          }
        },
      });
    });
  }
}
