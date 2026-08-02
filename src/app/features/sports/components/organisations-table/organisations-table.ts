import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Organisation } from '../../models/organisation.model';

@Component({
  selector: 'app-organisations-table',
  standalone: true,
  imports: [],
  templateUrl: './organisations-table.html',
  styleUrl: './organisations-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsTableComponent {
  @Input({ required: true })
  organisations: Organisation[] = [];

  @Input()
  isAdmin = false;

  @Output()
  view = new EventEmitter<Organisation>();

  @Output()
  edit = new EventEmitter<Organisation>();

  @Output()
  deleteOrganisation = new EventEmitter<string>();

  onView(organisation: Organisation): void {
    this.view.emit(organisation);
  }

  onEdit(organisation: Organisation): void {
    this.edit.emit(organisation);
  }

  onDelete(id: string): void {
    this.deleteOrganisation.emit(id);
  }
}
