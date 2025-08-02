import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core'; // <-- use Angular's inject
import { AuthService } from '../core/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Intercepted request to:', req.url);

  // You might want to add withCredentials here if you want to enforce it for all requests:
  const clonedReq = req.clone({
    withCredentials: true,
  });

  return next(clonedReq);
};
