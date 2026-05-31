import { Routes } from '@angular/router';
import { SharedLayout } from './core/layout/public/shared-layout/shared-layout';

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
            }
        ]
    }
];
