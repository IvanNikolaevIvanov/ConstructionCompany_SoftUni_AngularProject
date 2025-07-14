import { Component } from '@angular/core';
import { PrivateMenu } from '../../shared/private-menu/private-menu';

@Component({
  selector: 'agent-dashboard',
  imports: [PrivateMenu],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.scss',
})
export class AgentDashboard {
  currentUserRole: string = 'Agent';
}
