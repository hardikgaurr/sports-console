import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbItem } from '../../../../common/models/breadcrumb-item.model';
import { BreadcrumbsComponent } from '../../../../common/components/breadcrumbs/breadcrumbs.component';
import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { SportsService } from '../../services/sport.service';

@Component({
  selector: 'app-governing-body-detail',
  standalone: true,
  imports: [BreadcrumbsComponent, SportsStatsComponent],
  templateUrl: './governing-body-detail.html',
  styleUrl: './governing-body-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoverningBodyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sportsService = inject(SportsService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';

  readonly governingBodyId = this.route.snapshot.paramMap.get('gbId') ?? '';

  readonly sport = computed(() =>
    this.sportsService.sports().find((sport) => sport.id === this.sportId),
  );

  readonly governingBody = computed(() =>
    this.sportsService.governingBodies().find((body) => body.id === this.governingBodyId),
  );

  readonly organisations = computed(() =>
    this.sportsService
      .organisations()
      .filter((organisation) => organisation.governingBodyId === this.governingBodyId),
  );

  readonly participants = computed(() => this.sportsService.participants());

  readonly participantCount = computed(() => {
    const organisationIds = this.organisations().map((organisation) => organisation.id);

    return this.sportsService
      .participants()
      .filter((participant) => organisationIds.includes(participant.organisationId)).length;
  });

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
}
