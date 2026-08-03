import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { ConsoleLayoutComponent } from './core/layouts/console-layout/console-layout';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard';

import { SportsComponent } from './features/sports/pages/sports/sports';
import { SportDetailComponent } from './features/sports/pages/sport-detail/sport-detail';
import { GoverningBodyDetailComponent } from './features/sports/pages/governing-body-detail/governing-body-detail';
import { OrganisationDetailComponent } from './features/sports/pages/organisation-detail/organisation-detail';
import { ParticipantDetailComponent } from './features/sports/pages/participant-detail/participant-detail';

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
        redirectTo: 'sports',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        redirectTo: 'sports',
        pathMatch: 'full',
      },
      {
        path: 'sports',
        component: SportsComponent,
      },
      {
        path: 'sports/:sportId',
        component: SportDetailComponent,
      },
      {
        path: 'sports/:sportId/governing-bodies/:gbId/organisations/:orgId',
        component: OrganisationDetailComponent,
      },
      {
        path: 'sports/:sportId/governing-bodies/:gbId',
        component: GoverningBodyDetailComponent,
      },
      {
        path: 'sports/:sportId/governing-bodies/:gbId/organisations/:orgId/participants/:participantId',
        component: ParticipantDetailComponent,
      },
    ],
  },
];
