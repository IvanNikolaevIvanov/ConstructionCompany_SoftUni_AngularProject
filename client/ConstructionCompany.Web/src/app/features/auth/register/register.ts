import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const { firstName, lastName, email, password } = form.value;

    this.auth.register(firstName, lastName, email, password, () => {
      this.router.navigate(['/agent/dashboard']);
    });
  }
}
