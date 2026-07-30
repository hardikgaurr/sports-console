import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { InputType } from './input.types';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';

  @Input() placeholder = '';

  @Input() type: InputType = 'text';

  @Input() error = '';

  readonly hidePassword = signal(true);

  value = '';

  disabled = false;

  onChange: (value: string) => void = () => {};

  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  updateValue(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  togglePassword(): void {
    this.hidePassword.update((value) => !value);
  }

  get inputType(): string {
    if (this.type !== 'password') {
      return this.type;
    }

    return this.hidePassword() ? 'password' : 'text';
  }
}
