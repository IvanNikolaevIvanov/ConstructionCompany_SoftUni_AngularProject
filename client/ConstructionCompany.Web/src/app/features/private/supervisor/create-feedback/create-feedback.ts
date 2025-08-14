import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-feedback',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogActions,
    MatDialogContent,
    FormsModule,
  ],
  templateUrl: './create-feedback.html',
  styleUrl: './create-feedback.scss',
})
export class CreateFeedback {
  feedbackText = '';
  submitted = false;

  constructor(public dialogRef: MatDialogRef<CreateFeedback>) {}

  onSubmit() {
    this.submitted = true;

    if (!this.feedbackText.trim()) {
      return;
    }

    this.dialogRef.close(this.feedbackText);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
