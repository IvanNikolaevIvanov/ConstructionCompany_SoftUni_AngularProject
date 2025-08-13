import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-feedback-component',
  imports: [CommonModule, MatDialogActions, MatDialogContent, MatButtonModule],
  templateUrl: './feedback-component.html',
  styleUrl: './feedback-component.scss',
})
export class FeedbackComponent {
  constructor(
    public dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { author: string; message: string; date: string },
  ) {}

  onConfirm(): void {
    this.dialogRef.close();
  }
}
