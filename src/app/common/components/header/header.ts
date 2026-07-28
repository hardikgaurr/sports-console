import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  readonly searchIcon = 'assets/icons/header/search.svg';
  readonly notificationIcon = 'assets/icons/header/notification.svg';
  readonly profileIcon = 'assets/icons/header/profile.svg';
}
