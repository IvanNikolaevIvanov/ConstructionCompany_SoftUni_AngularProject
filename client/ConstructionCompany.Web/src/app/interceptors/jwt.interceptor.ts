import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core'; // <-- use Angular's inject
import { AuthService } from '../core/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token(); // computed() signal value

  console.log('Intercepted request to:', req.url);

  const clonedReq = req.clone({
    // withCredentials: true,

    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(clonedReq);
};
