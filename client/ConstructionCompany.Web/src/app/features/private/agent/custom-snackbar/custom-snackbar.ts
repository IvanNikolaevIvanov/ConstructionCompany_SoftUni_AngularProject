import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-snackbar',
  imports: [CommonModule, MatIconModule],
  templateUrl: './custom-snackbar.html',
  styleUrl: './custom-snackbar.scss',
})
export class CustomSnackbar {
  icon: string;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; type: string },
  ) {
    const iconsMap: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
    };
    this.icon = iconsMap[data.type] || 'info';
  }
}
