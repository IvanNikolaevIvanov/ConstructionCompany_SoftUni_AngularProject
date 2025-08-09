import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-snackbar',
  imports: [MatIconModule],
  templateUrl: './custom-snackbar.html',
  styleUrl: './custom-snackbar.scss',
})
export class CustomSnackbar {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
