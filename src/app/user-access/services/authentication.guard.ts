import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Authentication } from './authentication.service';
import { map, take } from 'rxjs';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const auth = inject(Authentication);
  const router = inject(Router);

  return auth.isSignedIn.pipe(
    take(1),
    map((isSignedIn) => {
      if (isSignedIn) return true;
      router.navigate(['/sign-in']).then();
      return false;
    }),
  );
};
