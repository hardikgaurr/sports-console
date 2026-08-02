import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { GoverningBody } from '../../models/governing-body.model';

@Component({
  selector: 'app-governing-bodies-table',
  standalone: true,
  imports: [],
  templateUrl: './governing-bodies-table.html',
  styleUrl: './governing-bodies-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoverningBodiesTableComponent {
  @Input({ required: true })
  governingBodies: GoverningBody[] = [];

  @Input()
  isAdmin = false;

  @Output()
  view = new EventEmitter<GoverningBody>();

  @Output()
  edit = new EventEmitter<GoverningBody>();

  @Output()
  deleteGoverningBody = new EventEmitter<string>();

  onView(governingBody: GoverningBody): void {
    this.view.emit(governingBody);
  }

  onEdit(governingBody: GoverningBody): void {
    this.edit.emit(governingBody);
  }

  onDelete(id: string): void {
    this.deleteGoverningBody.emit(id);
  }
}
