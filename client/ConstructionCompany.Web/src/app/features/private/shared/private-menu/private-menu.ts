import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'private-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './private-menu.html',
  styleUrl: './private-menu.scss',
})
export class PrivateMenu {
  @Input() role: string | undefined;
}
