import { Component, OnInit } from '@angular/core';
import { PrivateMenu } from '../private-menu/private-menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'private-layout',
  imports: [PrivateMenu, RouterOutlet],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout implements OnInit {
  currentUserRole = '';

  // constructor(private auth: AuthService) {}

  ngOnInit() {
    // this.currentUserRole = this.auth.userValue.role;
  }
}
