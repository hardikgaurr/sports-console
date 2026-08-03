import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

import { Staff, StaffCategory, StaffPayload } from '../../models/staff.model';

import { StaffService } from '../../services/staff.service';
import { UploadService } from '../../services/upload.service';
import { formatLabel } from '../../utils/format-label';
export interface AddEditStaffDialogData {
  mode: 'add' | 'edit';
  organisationId: string;
  staff?: Staff;
}

@Component({
  selector: 'app-add-edit-staff',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, InputComponent, ButtonComponent],
  templateUrl: './add-edit-staff.html',
  styleUrl: './add-edit-staff.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditStaffComponent {
  readonly formatLabel = formatLabel;
  readonly categories: StaffCategory[] = [
    'club_president',
    'executive_management',
    'operations_administration',
  ];

  readonly form;

  readonly saving = signal(false);

  readonly uploading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditStaffComponent>,
    private readonly staffService: StaffService,
    private readonly uploadService: UploadService,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AddEditStaffDialogData,
  ) {
    this.form = this.fb.nonNullable.group({
      name: [data.staff?.name ?? '', [Validators.required, Validators.maxLength(100)]],

      roleTitle: [data.staff?.roleTitle ?? '', [Validators.required, Validators.maxLength(100)]],

      category: [data.staff?.category ?? 'club_president', Validators.required],

      nationality: [data.staff?.nationality ?? ''],

      photoUrl: [data.staff?.photoUrl ?? ''],
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    this.uploading.set(true);
    this.errorMessage.set(null);

    this.uploadService.uploadImage(file).subscribe({
      next: ({ url }) => {
        this.form.patchValue({
          photoUrl: url,
        });

        this.uploading.set(false);
      },

      error: () => {
        this.uploading.set(false);
        this.errorMessage.set('Image upload failed. Please try again.');
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: StaffPayload = {
      name: value.name,
      roleTitle: value.roleTitle,
      category: value.category,
      nationality: value.nationality.trim() || null,
      photoUrl: value.photoUrl.trim() || null,
    };

    this.saving.set(true);
    this.errorMessage.set(null);

    const request$ =
      this.data.mode === 'edit' && this.data.staff
        ? this.staffService.updateStaff(this.data.staff.id, payload)
        : this.staffService.addStaff(this.data.organisationId, payload);

    request$.subscribe({
      next: (staff) => {
        this.saving.set(false);
        this.dialogRef.close(staff);
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
