import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Staff } from '../../models/staff.model';

@Component({
  selector: 'app-staff-table',
  standalone: true,
  imports: [],
  templateUrl: './staff-table.html',
  styleUrl: './staff-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffTableComponent {
  @Input({ required: true })
  staff: Staff[] = [];

  @Input()
  isAdmin = false;

  @Output()
  view = new EventEmitter<Staff>();

  @Output()
  edit = new EventEmitter<Staff>();

  @Output()
  deleteStaff = new EventEmitter<string>();

  onView(staff: Staff): void {
    this.view.emit(staff);
  }

  onEdit(staff: Staff): void {
    this.edit.emit(staff);
  }

  onDelete(id: string): void {
    this.deleteStaff.emit(id);
  }
}
