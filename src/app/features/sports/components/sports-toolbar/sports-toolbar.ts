import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { InputComponent } from '../../../../common/components/input/input.component';

@Component({
  selector: 'app-sports-toolbar',
  standalone: true,
  imports: [FormsModule, ButtonComponent, InputComponent],
  templateUrl: './sports-toolbar.html',
  styleUrl: './sports-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsToolbarComponent {
  @Input() searchQuery = '';

  @Output() searchChange = new EventEmitter<string>();

  @Output() addSport = new EventEmitter<void>();

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }

  onAddSport(): void {
    this.addSport.emit();
  }
}
