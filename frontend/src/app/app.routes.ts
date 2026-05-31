import { Routes } from '@angular/router';
import { SharedLayout } from './core/layout/public/shared-layout/shared-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: SharedLayout,
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/pages/public/login/login').then((m)=>m.Login)
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./features/pages/public/register/register').then((m)=>m.Register)
            },
            {
                path: 'register/:token',
                loadComponent: () =>
                    import('./features/pages/public/register.form/register.form').then((m)=>m.RegisterForm)
            },
            // rutas privadas
            {
                path: 'profile',
                canActivate: [authGuard],
                loadChildren: () =>
                    import('./features/routes/profile.routes').then((m) => m.profileRoutes),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
