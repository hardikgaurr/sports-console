import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../../common/components/header/header';
import { SidebarComponent } from '../../../common/components/sidebar/sidebar';

@Component({
  selector: 'app-console-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './console-layout.html',
  styleUrl: './console-layout.scss',
})
export class ConsoleLayoutComponent {
  collapsed = false;

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
}
