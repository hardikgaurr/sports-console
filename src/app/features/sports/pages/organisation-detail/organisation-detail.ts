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
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { BreadcrumbItem } from '../../../../common/models/breadcrumb-item.model';
import { BreadcrumbsComponent } from '../../../../common/components/breadcrumbs/breadcrumbs.component';
import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { ParticipantsTableComponent } from '../../components/participants-table/participants-table';

import { SportsService } from '../../services/sport.service';
import { GoverningBodyService } from '../../services/governing-body.service';
import { OrganisationService } from '../../services/organisation.service';
import { ParticipantService } from '../../services/participant.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';

import { Participant } from '../../models/participant.model';

@Component({
  selector: 'app-organisation-detail',
  standalone: true,
  imports: [BreadcrumbsComponent, SportsStatsComponent, ParticipantsTableComponent],
  templateUrl: './organisation-detail.html',
  styleUrl: './organisation-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sportsService = inject(SportsService);
  private readonly governingBodyService = inject(GoverningBodyService);
  private readonly organisationService = inject(OrganisationService);
  private readonly participantService = inject(ParticipantService);
  private readonly authState = inject(AuthStateService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';
  readonly governingBodyId = this.route.snapshot.paramMap.get('gbId') ?? '';
  readonly organisationId = this.route.snapshot.paramMap.get('orgId') ?? '';

  readonly loading = signal(true);

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
    { label: 'Sports', route: '/sports' },
    { label: this.sport()?.name ?? '', route: `/sports/${this.sportId}` },
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

  editParticipant(participant: Participant): void {
    // TODO: wire to add-edit-participant dialog once built
  }

  deleteParticipant(id: string): void {
    // TODO: wire to ParticipantService.deleteParticipant() + 409 handling once dialog exists
  }

  openAddParticipantDialog(): void {
    // TODO: wire to add-edit-participant dialog once built
  }
}
