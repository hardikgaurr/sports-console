import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

import { GoverningBody, GoverningBodyPayload } from '../../models/governing-body.model';
import { GoverningBodyService } from '../../services/governing-body.service';

export interface AddEditGoverningBodyDialogData {
  mode: 'add' | 'edit';
  sportId: string;
  governingBody?: GoverningBody;
}

@Component({
  selector: 'app-add-edit-governing-body',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, InputComponent, ButtonComponent],
  templateUrl: './add-edit-governing-body.html',
  styleUrl: './add-edit-governing-body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditGoverningBodyComponent {
  readonly form;

  readonly saving = signal(false);

  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditGoverningBodyComponent>,
    private readonly governingBodyService: GoverningBodyService,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AddEditGoverningBodyDialogData,
  ) {
    this.form = this.fb.group({
      name: [data.governingBody?.name ?? '', [Validators.required, Validators.maxLength(100)]],
      country: [data.governingBody?.country ?? '', [Validators.maxLength(100)]],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: GoverningBodyPayload = {
      sportId: this.data.sportId,
      name: this.form.getRawValue().name ?? '',
      country: this.form.getRawValue().country || null,
    };

    this.saving.set(true);
    this.errorMessage.set(null);

    const request$ =
      this.data.mode === 'edit' && this.data.governingBody
        ? this.governingBodyService.updateGoverningBody(this.data.governingBody.id, payload)
        : this.governingBodyService.addGoverningBody(payload);

    request$.subscribe({
      next: (governingBody) => {
        this.saving.set(false);
        this.dialogRef.close(governingBody);
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
