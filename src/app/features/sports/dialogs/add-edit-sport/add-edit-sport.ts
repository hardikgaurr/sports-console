import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

import { Sport, SportPayload } from '../../models/sport.model';
import { SportsService } from '../../services/sport.service';

export interface AddEditSportDialogData {
  mode: 'add' | 'edit';
  sport?: Sport;
}

@Component({
  selector: 'app-add-edit-sport',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, InputComponent, ButtonComponent],
  templateUrl: './add-edit-sport.html',
  styleUrl: './add-edit-sport.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditSportComponent {
  readonly form;
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditSportComponent>,
    private readonly sportsService: SportsService,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AddEditSportDialogData,
  ) {
    this.form = this.fb.nonNullable.group({
      name: [data.sport?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: SportPayload = {
      name: this.form.getRawValue().name,
    };

    this.saving.set(true);
    this.errorMessage.set(null);

    const request$ =
      this.data.mode === 'edit' && this.data.sport
        ? this.sportsService.updateSport(this.data.sport.id, payload)
        : this.sportsService.addSport(payload);

    request$.subscribe({
      next: (sport) => {
        this.saving.set(false);
        this.dialogRef.close(sport);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
