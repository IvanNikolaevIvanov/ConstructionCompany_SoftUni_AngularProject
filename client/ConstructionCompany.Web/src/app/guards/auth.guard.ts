// src/app/guards/auth.guard.ts

import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const loggedIn = auth.isLoggedIn();

  const allowedRoles = route.data['roles'] as string[] | undefined;
  const userRole = auth.role();

  if (!loggedIn) {
    // Redirect to login preserving returnUrl
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (allowedRoles && !allowedRoles.includes(userRole!)) {
    return false;
  }

  return true;
};
