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
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { BreadcrumbsComponent } from '../../../../common/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItem } from '../../../../common/models/breadcrumb-item.model';

import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';

import { SportsService } from '../../services/sport.service';
import { GoverningBodyService } from '../../services/governing-body.service';
import { OrganisationService } from '../../services/organisation.service';
import { ParticipantService } from '../../services/participant.service';

import { AuthStateService } from '../../../auth/services/auth-state.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-participant-detail',
  standalone: true,
  imports: [DatePipe, BreadcrumbsComponent, SportsStatsComponent],
  templateUrl: './participant-detail.html',
  styleUrl: './participant-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sportsService = inject(SportsService);
  private readonly governingBodyService = inject(GoverningBodyService);
  private readonly organisationService = inject(OrganisationService);
  private readonly participantService = inject(ParticipantService);
  private readonly authState = inject(AuthStateService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';
  readonly governingBodyId = this.route.snapshot.paramMap.get('gbId') ?? '';
  readonly organisationId = this.route.snapshot.paramMap.get('orgId') ?? '';
  readonly participantId = this.route.snapshot.paramMap.get('participantId') ?? '';

  readonly loading = signal(true);

  readonly isAdmin = computed(() => this.authState.user()?.role === 'admin');

  readonly sport = computed(() =>
    this.sportsService.sports().find((sport) => sport.id === this.sportId),
  );

  readonly governingBody = computed(() =>
    this.governingBodyService.governingBodies().find((body) => body.id === this.governingBodyId),
  );

  readonly organisation = computed(() =>
    this.organisationService
      .organisations()
      .find((organisation) => organisation.id === this.organisationId),
  );

  readonly participant = computed(() =>
    this.participantService
      .participants()
      .find((participant) => participant.id === this.participantId),
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
    {
      label: this.participant()?.name ?? '',
      route: `/sports/${this.sportId}/governing-bodies/${this.governingBodyId}/organisations/${this.organisationId}/participants/${this.participantId}`,
    },
  ]);

  ngOnInit(): void {
    forkJoin([
      this.sportsService.getSport(this.sportId),
      this.governingBodyService.getGoverningBody(this.governingBodyId),
      this.organisationService.getOrganisation(this.organisationId),
      this.participantService.getParticipant(this.participantId),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false),
      });
  }
}
