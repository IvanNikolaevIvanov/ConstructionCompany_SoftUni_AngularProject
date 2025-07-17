import { Routes } from '@angular/router';
import { PublicPage } from './features/public';
import { authGuard } from './guards/auth.guard';
import {
  AgentDashboard,
  PrivateLayout,
  SupervisorDashboard,
} from './features/private';

// add lazy loading for the components
export const routes: Routes = [
  { path: '', component: PublicPage },

  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: PrivateLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'agent/dashboard',
        component: AgentDashboard,
        canActivate: [authGuard],
        data: { roles: ['Agent'] },
      },
      {
        path: 'supervisor/dashboard',
        component: SupervisorDashboard,
        canActivate: [authGuard],
        data: { roles: ['Supervisor'] },
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
