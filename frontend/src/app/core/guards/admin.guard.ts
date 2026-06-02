import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/services/auth/auth.service';
import { CLAIMS } from '../../shared/constants/claims.constants';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const payload = auth.payload() as any;
  const role = payload?.[CLAIMS.ROLE];

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (role !== 'Administrador') {
    router.navigate(['/home']);
    return false;
  }

  return true;
};