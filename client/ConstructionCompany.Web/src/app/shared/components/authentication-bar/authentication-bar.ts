import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'authentication-bar',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './authentication-bar.html',
  styleUrl: './authentication-bar.scss',
})
export class AuthenticationBar implements OnInit {
  isUserLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.isUserLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
