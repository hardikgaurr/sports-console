import { Routes } from '@angular/router';

import { ConsoleLayoutComponent } from './core/layouts/console-layout/console-layout';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: ConsoleLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
];
