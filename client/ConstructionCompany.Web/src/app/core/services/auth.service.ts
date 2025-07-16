import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse';
import { HttpClient } from '@angular/common/http';
// use signals
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<LoginResponse | null>(
    JSON.parse(localStorage.getItem(this.tokenKey) || 'null')
  );

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>('/api/auth/login', { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, JSON.stringify(res));
          this.userSubject.next(res);
        }),
        map(() => {})
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  get userValue(): LoginResponse | null {
    return this.userSubject.value;
  }

  get token(): string | null {
    return this.userValue?.token || null;
  }

  get isLoggedIn(): boolean {
    const t = this.token;
    if (!t) return false;
    const payload = JSON.parse(atob(t.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  }

  get role(): string | undefined {
    return this.userValue?.role;
  }
}
