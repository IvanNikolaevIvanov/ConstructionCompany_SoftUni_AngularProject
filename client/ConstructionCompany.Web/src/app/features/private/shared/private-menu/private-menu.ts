import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'app/core/services';

@Component({
  selector: 'private-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './private-menu.html',
  styleUrl: './private-menu.scss',
})
export class PrivateMenu implements OnInit {
  role: string | undefined;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.role = this.auth.role();
    console.log(`User Role in Private Menu is: ${this.role}`);
  }
}
