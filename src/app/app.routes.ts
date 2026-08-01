import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { ConsoleLayoutComponent } from './core/layouts/console-layout/console-layout';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard';
import { SportsComponent } from './features/sports/pages/sports/sports';
import { SportDetailComponent } from './features/sports/pages/sport-detail/sport-detail';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: ConsoleLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'sports',
        component: SportsComponent,
      },
      {
        path: 'sports/:sportId',
        component: SportDetailComponent,
      },
    ],
  },
];
