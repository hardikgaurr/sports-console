import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SIDEBAR_SECTIONS, SidebarSection } from '../../constants/sidebar.constants';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @Input() collapsed = false;

  @Output() toggle = new EventEmitter<void>();

  readonly sections: SidebarSection[] = SIDEBAR_SECTIONS;

  readonly logo = 'assets/logos/buzzer-logo.svg';
  readonly collapseIcon = 'assets/icons/common/collapse.svg';

  toggleSidebar(): void {
    this.toggle.emit();
  }
}
