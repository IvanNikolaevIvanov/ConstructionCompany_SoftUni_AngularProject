// src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  //   const auth = inject(AuthService);
  //   const router = inject(Router);

  // I prefer synchronously checking a stored user info
  //   const user = auth.userValue;
  //   if (user) {
  // Optionally check role-based access:
  // const allowedRoles = route.data['roles'] as string[];
  // if (allowedRoles?.includes(user.role)) return true;
  //     return true;
  //   }

  // Redirect to login while preserving the intended URL
  //   return router.createUrlTree(['/login'], {
  //     queryParams: { returnUrl: state.url },
  //   });
  return true;
};
