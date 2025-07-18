import { Injectable, signal, computed, effect } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
// use signals
@Injectable({ providedIn: 'root' })
export class AuthService {
  // private url = `${environment.apiUrl}`;

  // Private signal holding the login object (or null)
  private loginData = signal<LoginResponse | null>(null);

  // Load saved data on startup
  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('auth_token');
    this.loginData.set(saved ? JSON.parse(saved) : null);

    // Automatically sync storage with signal changes
    effect(() => {
      const data = this.loginData();
      if (data) {
        localStorage.setItem('auth_token', JSON.stringify(data));
      } else {
        localStorage.removeItem('auth_token');
      }
    });
  }

  // Extracted values for components/guards
  readonly token = computed(() => this.loginData()?.token ?? null);

  readonly role = computed(() => this.loginData()?.role);

  readonly isLoggedIn = computed(() => {
    const t = this.token();
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  });

  // Perform login
  login(email: string, password: string): void {
    this.http
      .post<LoginResponse>(`${environment.apiUrl}/Auth/login`, {
        email,
        password,
      })
      .subscribe({
        next: (res) => this.loginData.set(res),
        error: (err) => {
          console.error('Login failed', err);
          throw err; // or handle error gracefully
        },
      });
  }

  // Clear auth
  logout(): void {
    this.loginData.set(null);
  }
}

// private tokenKey = 'auth_token';
// private userSubject = new BehaviorSubject<LoginResponse | null>(
//   JSON.parse(localStorage.getItem(this.tokenKey) || 'null')
// );

// user$ = this.userSubject.asObservable();

// constructor(private http: HttpClient) {}

// login(username: string, password: string): Observable<void> {
//   return this.http
//     .post<LoginResponse>('/api/auth/login', { username, password })
//     .pipe(
//       tap((res) => {
//         localStorage.setItem(this.tokenKey, JSON.stringify(res));
//         this.userSubject.next(res);
//       }),
//       map(() => {})
//     );
// }

// logout(): void {
//   localStorage.removeItem(this.tokenKey);
//   this.userSubject.next(null);
// }

// get userValue(): LoginResponse | null {
//   return this.userSubject.value;
// }

// get token(): string | null {
//   return this.userValue?.token || null;
// }

// get isLoggedIn(): boolean {
//   const t = this.token;
//   if (!t) return false;
//   const payload = JSON.parse(atob(t.split('.')[1]));
//   return payload.exp * 1000 > Date.now();
// }

// get role(): string | undefined {
//   return this.userValue?.role;
// }
