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
import { OrganisationsTableComponent } from '../../components/organisations-table/organisations-table';

import { SportsService } from '../../services/sport.service';
import { GoverningBodyService } from '../../services/governing-body.service';
import { OrganisationService } from '../../services/organisation.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';

import { Organisation } from '../../models/organisation.model';

@Component({
  selector: 'app-governing-body-detail',
  standalone: true,
  imports: [BreadcrumbsComponent, SportsStatsComponent, OrganisationsTableComponent],
  templateUrl: './governing-body-detail.html',
  styleUrl: './governing-body-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoverningBodyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sportsService = inject(SportsService);
  private readonly governingBodyService = inject(GoverningBodyService);
  private readonly organisationService = inject(OrganisationService);
  private readonly authState = inject(AuthStateService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';
  readonly governingBodyId = this.route.snapshot.paramMap.get('gbId') ?? '';

  readonly loading = signal(true);

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
    { label: 'Sports', route: '/sports' },
    { label: this.sport()?.name ?? '', route: `/sports/${this.sportId}` },
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

  editOrganisation(organisation: Organisation): void {
    // TODO: wire to add-edit-organisation dialog once available in this page
  }

  deleteOrganisation(id: string): void {
    // TODO: wire to OrganisationService.deleteOrganisation() + 409 handling
  }

  openAddOrganisationDialog(): void {
    // TODO: wire to add-edit-organisation dialog once available in this page
  }
}
