import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Sport } from '../../models/sport.model';

@Component({
  selector: 'app-sports-table',
  standalone: true,
  imports: [],
  templateUrl: './sports-table.html',
  styleUrl: './sports-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsTableComponent {
  @Input({ required: true })
  sports: Sport[] = [];
  @Output()
  view = new EventEmitter<Sport>();

  onView(sport: Sport): void {
    this.view.emit(sport);
  }
  @Output()
  edit = new EventEmitter<Sport>();

  @Output()
  deleteSport = new EventEmitter<string>();

  onEdit(sport: Sport): void {
    this.edit.emit(sport);
  }
  onDelete(id: string): void {
    this.deleteSport.emit(id);
  }
}
