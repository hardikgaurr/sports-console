import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';

import { SportPayload } from '../../models/sport.model';
import { parseImportFile } from '../../utils/bulk-import.util';

@Component({
  selector: 'app-bulk-import',
  standalone: true,
  imports: [],
  templateUrl: './bulk-import.component.html',
  styleUrl: './bulk-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkImportComponent {
  readonly loading = signal(false);

  @Output()
  importReady = new EventEmitter<SportPayload[]>();

  @Output()
  importError = new EventEmitter<string>();

  @Output()
  importCancelled = new EventEmitter<void>();

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      this.importCancelled.emit();
      return;
    }

    this.loading.set(true);

    try {
      const payload = await parseImportFile(file);

      this.importReady.emit(payload);
    } catch (error) {
      this.importError.emit(
        error instanceof Error ? error.message : 'Failed to parse import file.',
      );
    } finally {
      this.loading.set(false);

      (event.target as HTMLInputElement).value = '';
    }
  }

  cancel(): void {
    this.importCancelled.emit();
  }
}
