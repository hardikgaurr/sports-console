import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbsComponent } from '../../../../common/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItem } from '../../../../common/models/breadcrumb-item.model';

import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { SportsService } from '../../services/sport.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-sport-detail',
  standalone: true,
  imports: [DatePipe, BreadcrumbsComponent, SportsStatsComponent],
  templateUrl: './sport-detail.html',
  styleUrl: './sport-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sportsService = inject(SportsService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';

  readonly sport = computed(() =>
    this.sportsService.sports().find((sport) => sport.id === this.sportId),
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

  readonly governingBodiesCount = computed(
    () =>
      this.sportsService.governingBodies().filter((body) => body.sportId === this.sportId).length,
  );

  readonly organisationsCount = computed(() => {
    const governingBodyIds = this.sportsService
      .governingBodies()
      .filter((body) => body.sportId === this.sportId)
      .map((body) => body.id);

    return this.sportsService
      .organisations()
      .filter((organisation) => governingBodyIds.includes(organisation.governingBodyId)).length;
  });

  readonly participantsCount = computed(() => {
    const organisationIds = this.sportsService
      .organisations()
      .filter((organisation) =>
        this.sportsService
          .governingBodies()
          .some(
            (body) => body.id === organisation.governingBodyId && body.sportId === this.sportId,
          ),
      )
      .map((organisation) => organisation.id);

    return this.sportsService
      .participants()
      .filter((participant) => organisationIds.includes(participant.organisationId)).length;
  });
}
