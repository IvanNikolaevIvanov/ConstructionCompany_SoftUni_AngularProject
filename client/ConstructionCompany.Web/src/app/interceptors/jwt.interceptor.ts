import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core'; // <-- use Angular's inject
import { AuthService } from '../core/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const token = auth.token();

  console.log('Intercepted request to:', req.url);
  console.log('Token:', token);

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  console.log('Auth header will be:', token ? `Bearer ${token}` : 'No token');

  return next(req);
};
