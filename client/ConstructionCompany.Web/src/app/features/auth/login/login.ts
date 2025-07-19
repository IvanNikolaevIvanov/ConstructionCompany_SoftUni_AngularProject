import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  returnUrl: string | null = null;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.auth.login(form.value.email, form.value.password, () => {
      const role = this.auth.role();

      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else if (role === 'Agent') {
        this.router.navigate(['/agent/dashboard']);
      } else if (role === 'Supervisor') {
        this.router.navigate(['/supervisor/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
