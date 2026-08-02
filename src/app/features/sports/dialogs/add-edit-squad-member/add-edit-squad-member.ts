import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

import { AppUser, SquadMember, SquadMemberPayload } from '../../models/squad.model';

import { SquadService } from '../../services/squad.service';

export interface AddEditSquadMemberDialogData {
  mode: 'add' | 'edit';
  organisationId: string;
  squadMember?: SquadMember;
}

@Component({
  selector: 'app-add-edit-squad-member',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, InputComponent, ButtonComponent],
  templateUrl: './add-edit-squad-member.html',
  styleUrl: './add-edit-squad-member.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditSquadMemberComponent implements OnInit {
  readonly form;

  readonly users = signal<AppUser[]>([]);

  readonly loadingUsers = signal(true);

  readonly saving = signal(false);

  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddEditSquadMemberComponent>,
    private readonly squadService: SquadService,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AddEditSquadMemberDialogData,
  ) {
    this.form = this.fb.nonNullable.group({
      userId: [data.squadMember?.userId ?? '', Validators.required],

      position: [
        data.squadMember?.position ?? '',
        [Validators.required, Validators.maxLength(100)],
      ],

      agreementEnd: [data.squadMember?.agreementEnd ?? ''],
    });
  }

  ngOnInit(): void {
    this.squadService.searchUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loadingUsers.set(false);
      },
      error: () => {
        this.loadingUsers.set(false);
        this.errorMessage.set('Could not load users.');
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: SquadMemberPayload = {
      userId: value.userId,
      position: value.position,
      agreementEnd: value.agreementEnd.trim() || null,
    };

    this.saving.set(true);
    this.errorMessage.set(null);

    const request$ =
      this.data.mode === 'edit' && this.data.squadMember
        ? this.squadService.updateSquadMember(this.data.squadMember.id, payload)
        : this.squadService.addSquadMember(this.data.organisationId, payload);

    request$.subscribe({
      next: (member) => {
        this.saving.set(false);
        this.dialogRef.close(member);
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
