import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Participant } from '../../models/participant.model';

@Component({
  selector: 'app-participants-table',
  standalone: true,
  imports: [],
  templateUrl: './participants-table.html',
  styleUrl: './participants-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsTableComponent {
  @Input({ required: true })
  participants: Participant[] = [];

  @Input()
  isAdmin = false;

  @Output()
  view = new EventEmitter<Participant>();

  @Output()
  edit = new EventEmitter<Participant>();

  @Output()
  deleteParticipant = new EventEmitter<string>();

  onView(participant: Participant): void {
    this.view.emit(participant);
  }

  onEdit(participant: Participant): void {
    this.edit.emit(participant);
  }

  onDelete(id: string): void {
    this.deleteParticipant.emit(id);
  }
}
