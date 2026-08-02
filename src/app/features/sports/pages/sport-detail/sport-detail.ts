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

import { BreadcrumbsComponent } from '../../../../common/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItem } from '../../../../common/models/breadcrumb-item.model';
import { SportsStatsComponent } from '../../components/sports-stats/sports-stats';
import { GoverningBodiesTableComponent } from '../../components/governing-bodies-table/governing-bodies-table';

import { SportsService } from '../../services/sport.service';
import { GoverningBodyService } from '../../services/governing-body.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';

import { GoverningBody } from '../../models/governing-body.model';

@Component({
  selector: 'app-sport-detail',
  standalone: true,
  imports: [BreadcrumbsComponent, SportsStatsComponent, GoverningBodiesTableComponent],
  templateUrl: './sport-detail.html',
  styleUrl: './sport-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sportsService = inject(SportsService);
  private readonly governingBodyService = inject(GoverningBodyService);
  private readonly authState = inject(AuthStateService);

  readonly sportId = this.route.snapshot.paramMap.get('sportId') ?? '';

  readonly loading = signal(true);

  readonly isAdmin = computed(() => this.authState.user()?.role === 'admin');

  readonly sport = computed(() =>
    this.sportsService.sports().find((sport) => sport.id === this.sportId),
  );

  readonly governingBodies = computed(() =>
    this.governingBodyService.governingBodies().filter((body) => body.sportId === this.sportId),
  );

  readonly breadcrumbs = computed<BreadcrumbItem[]>(() => [
    { label: 'Sports', route: '/sports' },
    { label: this.sport()?.name ?? '', route: `/sports/${this.sportId}` },
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

  editGoverningBody(body: GoverningBody): void {
    // TODO: wire to add-edit-governing-body dialog once available in this page
  }

  deleteGoverningBody(id: string): void {
    // TODO: wire to GoverningBodyService.deleteGoverningBody() + 409 handling
  }

  openAddGoverningBodyDialog(): void {
    // TODO: wire to add-edit-governing-body dialog once available in this page
  }
}
