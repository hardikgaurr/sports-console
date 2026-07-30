import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.restoreSession().subscribe();
  }
}
