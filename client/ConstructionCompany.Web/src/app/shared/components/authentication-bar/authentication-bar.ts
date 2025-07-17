import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'authentication-bar',
  imports: [RouterLink],
  templateUrl: './authentication-bar.html',
  styleUrl: './authentication-bar.scss',
})
export class AuthenticationBar {}
