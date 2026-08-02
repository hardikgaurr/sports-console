import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

import { Participant, ParticipantPayload } from '../../models/participant.model';

import { ParticipantService } from '../../services/participant.service';

export interface AddEditParticipantDialogData {
  mode: 'add' | 'edit';
  organisationId: string;
  participant?: Participant;
}

@Component({
  selector: 'app-add-edit-participant',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, InputComponent, ButtonComponent],
  templateUrl: './add-edit-participant.html',
  styleUrl: './add-edit-participant.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditParticipantComponent {
  readonly form;

  readonly saving = signal(false);

  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditParticipantComponent>,
    private readonly participantService: ParticipantService,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AddEditParticipantDialogData,
  ) {
    this.form = this.fb.nonNullable.group({
      name: [data.participant?.name ?? '', [Validators.required, Validators.maxLength(100)]],

      role: [data.participant?.role ?? '', [Validators.maxLength(100)]],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: ParticipantPayload = {
      organisationId: this.data.organisationId,
      name: value.name,
      role: value.role.trim() || null,
    };

    this.saving.set(true);
    this.errorMessage.set(null);

    const request$ =
      this.data.mode === 'edit' && this.data.participant
        ? this.participantService.updateParticipant(this.data.participant.id, payload)
        : this.participantService.addParticipant(payload);

    request$.subscribe({
      next: (participant) => {
        this.saving.set(false);
        this.dialogRef.close(participant);
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
