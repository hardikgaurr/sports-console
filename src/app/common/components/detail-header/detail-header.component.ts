import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-detail-header',
  standalone: true,
  templateUrl: './detail-header.component.html',
  styleUrl: './detail-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailHeaderComponent {
  readonly title = input.required<string>();

  readonly subtitle = input<string>('');

  readonly emoji = input<string>('');

  readonly metadata = input<string>('');

  readonly actionLabel = input<string>('');
}
