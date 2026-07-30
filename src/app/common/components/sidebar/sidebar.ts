import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SIDEBAR_SECTIONS, SidebarSection } from '../../constants/sidebar.constants';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AuthStateService } from '../../../features/auth/services/auth-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @Input() collapsed = false;

  @Output() toggle = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  readonly sections: SidebarSection[] = SIDEBAR_SECTIONS;

  readonly logo = 'assets/logos/buzzer-logo.svg';
  readonly collapseIcon = 'assets/icons/common/collapse.svg';

  readonly initials = computed(() => {
    const user = this.authState.user();

    if (!user) {
      return '?';
    }

    return user.name.trim().charAt(0).toUpperCase();
  });

  toggleSidebar(): void {
    this.toggle.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
