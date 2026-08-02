import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbItem } from '../../models/breadcrumb-item.model';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  readonly items = input.required<BreadcrumbItem[]>();

  constructor(private readonly router: Router) {}

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }
}
