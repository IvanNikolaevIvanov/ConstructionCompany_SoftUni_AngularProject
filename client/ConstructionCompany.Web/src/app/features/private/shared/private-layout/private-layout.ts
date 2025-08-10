import { Component, OnInit } from '@angular/core';
import { PrivateMenu } from '../private-menu/private-menu';
import { RouterOutlet } from '@angular/router';
import { AuthenticationBar } from 'app/shared/components/authentication-bar/authentication-bar';
import { AuthService } from 'app/core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'private-layout',
  imports: [CommonModule, PrivateMenu, RouterOutlet, AuthenticationBar],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout {}
