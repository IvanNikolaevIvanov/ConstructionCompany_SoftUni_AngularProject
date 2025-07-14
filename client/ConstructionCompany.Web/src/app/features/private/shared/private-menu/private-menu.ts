import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'private-menu',
  imports: [CommonModule],
  templateUrl: './private-menu.html',
  styleUrl: './private-menu.scss',
})
export class PrivateMenu {
  @Input() role: string | undefined = 'Agent';
}
