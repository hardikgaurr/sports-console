import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-sports-stats',
  standalone: true,
  imports: [],
  templateUrl: './sports-stats.html',
  styleUrl: './sports-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsStatsComponent {
  @Input({ required: true }) totalSports = 0;

  @Input({ required: true }) totalBodies = 0;

  @Input() competitions = 0;

  @Input() participants = 0;
}
