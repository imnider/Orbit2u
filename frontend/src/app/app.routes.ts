import { Routes } from '@angular/router';
import { PublicLayout } from './core/layout/public/public-layout/public-layout';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayout,
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/pages/public/login/login').then((m)=>m.Login)
            }
        ]
    }
];
