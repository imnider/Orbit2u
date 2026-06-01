import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../features/services/auth/token.service';
import { AuthService } from '../../features/services/auth/auth.service';
import { switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = tokenService.getToken();

  if (token && tokenService.isTokenExpiringSoon(token)) {
    return authService.renew().pipe(
      switchMap(() => {
        const newToken = tokenService.getToken();

        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        return next(authReq);
      }),
    );
  }

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq);
};
