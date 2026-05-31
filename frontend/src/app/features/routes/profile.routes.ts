import { Routes } from '@angular/router';
import { Profile } from '../pages/private/profile/profile/profile';

export const profileRoutes: Routes = [
  {
    path: '',
    component: Profile,
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full',
      },
      {
        path: 'view',
        loadComponent: () =>
          import('../pages/private/profile//profile-view/profile-view').then((m) => m.ProfileView),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('../pages/private/profile/profile-edit/profile-edit').then((m) => m.ProfileEdit),
      },
      {
        path: 'password',
        loadComponent: () =>
          import('../pages/private/profile/profile-password/profile-password').then((m) => m.ProfilePassword),
      },
    ],
  },
];