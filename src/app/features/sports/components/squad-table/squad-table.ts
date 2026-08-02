import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SquadMember } from '../../models/squad.model';

@Component({
  selector: 'app-squad-table',
  standalone: true,
  imports: [],
  templateUrl: './squad-table.html',
  styleUrl: './squad-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquadTableComponent {
  @Input({ required: true })
  squad: SquadMember[] = [];

  @Input()
  isAdmin = false;

  @Output()
  view = new EventEmitter<SquadMember>();

  @Output()
  edit = new EventEmitter<SquadMember>();

  @Output()
  deleteSquadMember = new EventEmitter<string>();

  onView(member: SquadMember): void {
    this.view.emit(member);
  }

  onEdit(member: SquadMember): void {
    this.edit.emit(member);
  }

  onDelete(id: string): void {
    this.deleteSquadMember.emit(id);
  }

  getInitial(displayName: string): string {
    const trimmed = displayName.trim();

    if (!trimmed) {
      return '?';
    }

    return trimmed.charAt(0).toUpperCase();
  }
}
