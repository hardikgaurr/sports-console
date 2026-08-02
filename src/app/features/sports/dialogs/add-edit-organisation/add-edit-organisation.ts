import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

import { Organisation, OrganisationPayload } from '../../models/organisation.model';

import { OrganisationService } from '../../services/organisation.service';
import { UploadService } from '../../services/upload.service';

export interface AddEditOrganisationDialogData {
  mode: 'add' | 'edit';
  governingBodyId: string;
  organisation?: Organisation;
}

@Component({
  selector: 'app-add-edit-organisation',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, InputComponent, ButtonComponent],
  templateUrl: './add-edit-organisation.html',
  styleUrl: './add-edit-organisation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditOrganisationComponent {
  readonly form;

  readonly saving = signal(false);

  readonly uploading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditOrganisationComponent>,
    private readonly organisationService: OrganisationService,
    private readonly uploadService: UploadService,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AddEditOrganisationDialogData,
  ) {
    this.form = this.fb.nonNullable.group({
      name: [data.organisation?.name ?? '', [Validators.required, Validators.maxLength(100)]],

      type: [data.organisation?.type ?? '', [Validators.required, Validators.maxLength(100)]],

      country: [data.organisation?.country ?? ''],

      crestUrl: [data.organisation?.crestUrl ?? ''],
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
          crestUrl: url,
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

    const payload: OrganisationPayload = {
      name: value.name,
      type: value.type,
      country: value.country.trim() || null,
      crestUrl: value.crestUrl.trim() || null,
      governingBodyId: this.data.governingBodyId,
    };

    this.saving.set(true);
    this.errorMessage.set(null);

    const request$ =
      this.data.mode === 'edit' && this.data.organisation
        ? this.organisationService.updateOrganisation(this.data.organisation.id, payload)
        : this.organisationService.addOrganisation(payload);

    request$.subscribe({
      next: (organisation) => {
        this.saving.set(false);
        this.dialogRef.close(organisation);
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
