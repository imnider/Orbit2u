import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  inject,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ThemeService } from './core/services/theme/theme.service';
import { AuthService } from './features/services/auth/auth.service';

function initializeTheme() {
  const themeService = inject(ThemeService);
  return () => themeService.init();
}

export function initializeAuth(authService: AuthService) {
  return () => {
    authService.initSession();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
};
