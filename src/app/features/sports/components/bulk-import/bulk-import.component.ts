import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { SportPayload } from '../../models/sport.model';
import { parseImportFile } from '../../utils/bulk-import.util';

@Component({
  selector: 'app-bulk-import',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './bulk-import.component.html',
  styleUrl: './bulk-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkImportComponent {
  private readonly dialogRef = inject(MatDialogRef<BulkImportComponent>);

  readonly loading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      const payload: SportPayload[] = await parseImportFile(file);

      this.dialogRef.close(payload);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Failed to parse file.');
    } finally {
      this.loading.set(false);

      (event.target as HTMLInputElement).value = '';
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
