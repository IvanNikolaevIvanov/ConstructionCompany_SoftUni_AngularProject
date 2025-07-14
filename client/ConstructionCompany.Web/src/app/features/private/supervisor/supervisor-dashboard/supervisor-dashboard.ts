import { Component } from '@angular/core';
import { PrivateMenu } from '../../shared/private-menu/private-menu';

@Component({
  selector: 'supervisor-dashboard',
  imports: [PrivateMenu],
  templateUrl: './supervisor-dashboard.html',
  styleUrl: './supervisor-dashboard.scss',
})
export class SupervisorDashboard {
  currentUserRole: string = 'Supervisor';
}
