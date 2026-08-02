import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { Sport } from '../../models/sport.model';

export interface DeleteConfirmationDialogData {
  title: string;
  name: string;
}

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [MatDialogModule, ButtonComponent],
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: DeleteConfirmationDialogData,
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
