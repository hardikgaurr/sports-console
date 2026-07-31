import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

import { Sport } from '../../models/sport.model';

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

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditSportComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AddEditSportDialogData,
  ) {
    this.form = this.fb.nonNullable.group({
      name: [data.sport?.name ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [
        data.sport?.description ?? '',
        [Validators.required, Validators.maxLength(250)],
      ],
      governingBodyCount: [
        data.sport?.governingBodyCount ?? 0,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const sport: Sport = {
      id: this.data.sport?.id ?? crypto.randomUUID(),
      name: value.name,
      description: value.description,
      governingBodyCount: Number(value.governingBodyCount),
      createdAt: this.data.sport?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.dialogRef.close(sport);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
