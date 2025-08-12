import { Routes } from '@angular/router';
import { PublicPage } from './features/public';
import { authGuard } from './guards/auth.guard';
import {
  AgentDashboard,
  AgentFeedbacks,
  AllApplications,
  CreateNewApplication,
  FileUpload,
  PrivateLayout,
  SupervisorDashboard,
} from './features/private';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { NotFound } from './shared/components';

// add lazy loading for the components
export const routes: Routes = [
  { path: '', component: PublicPage },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

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
        path: 'agent/application-form',
        component: CreateNewApplication,
        canActivate: [authGuard],
        data: { roles: ['Agent'] },
      },
      {
        path: 'agent/application-form/:id',
        component: CreateNewApplication,
        canActivate: [authGuard],
        data: { roles: ['Agent'] },
      },
      {
        path: 'agent/agent-feedbacks',
        component: AgentFeedbacks,
        canActivate: [authGuard],
        data: { roles: ['Agent'] },
      },
      {
        path: 'supervisor/dashboard',
        component: SupervisorDashboard,
        canActivate: [authGuard],
        data: { roles: ['Supervisor'] },
      },
      {
        path: 'supervisor/all-applications',
        component: AllApplications,
        canActivate: [authGuard],
        data: { roles: ['Supervisor'] },
      },
    ],
  },

  { path: '**', component: NotFound },
];
