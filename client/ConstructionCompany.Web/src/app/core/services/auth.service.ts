import { Injectable, signal, computed, effect } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
// use signals
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Private signal holding the login object (or null)
  private loginData = signal<LoginResponse | null>(null);

  // Load saved data on startup
  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('auth_user');
    this.loginData.set(saved ? JSON.parse(saved) : null);

    console.log('loginData:', this.loginData());
    // Automatically sync storage with signal changes
    effect(() => {
      console.log('loginData:', this.loginData());
      const data = this.loginData();
      if (data) {
        localStorage.setItem('auth_user', JSON.stringify(data));
      } else {
        localStorage.removeItem('auth_user');
      }
    });
  }

  // Extracted values for components/guards
  readonly token = computed(() => this.loginData()?.token ?? null);

  readonly role = computed(() => this.loginData()?.role);

  readonly isLoggedIn = computed(() => this.loginData() !== null);

  readonly userId = computed(() => this.loginData()?.userId);

  /** Login using cookie-based JWT */
  login(
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (errorMsg: string) => void,
  ): void {
    this.http
      .post<LoginResponse>(`http://localhost:5247/api/Auth/login`, {
        email,
        password,
      })
      .subscribe({
        next: (res) => {
          this.loginData.set(res);
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          console.error('Login failed', err);
          const message =
            err?.error?.message || err?.error || 'Invalid credentials.';
          if (onError) onError(message);
        },
      });
  }

  // Clear auth
  logout(): void {
    this.loginData.set(null);
    // this.http
    //   .post(`${environment.apiUrl}/Auth/logout`, {}, { withCredentials: true })
    //   .subscribe({
    //     next: () => {
    //       this.loginData.set(null); // clear UI state
    //     },
    //     error: (err) => console.error('Logout failed', err),
    //   });
  }

  register(email: string, password: string, onSuccess?: () => void): void {
    this.http
      .post<LoginResponse>(`${environment.apiUrl}/Auth/register`, {
        email,
        password,
      })
      .subscribe({
        next: (res) => {
          this.loginData.set(res);
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          console.error('Register failed', err);
          throw err;
        },
      });
  }
}
