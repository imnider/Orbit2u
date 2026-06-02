import { Routes } from '@angular/router';
import { SharedLayout } from './core/layout/public/shared-layout/shared-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: SharedLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./features/pages/public/home/home').then((m) => m.Home),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/pages/public/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/pages/public/register/register').then((m) => m.Register),
      },
      {
        path: 'register/:token',
        loadComponent: () =>
          import('./features/pages/public/register.form/register.form').then((m) => m.RegisterForm),
      },
      // rutas privadas
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./features/routes/profile.routes').then((m) => m.profileRoutes),
      },
      {
        path: 'create-channel',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/pages/private/channel/create-channel/create-channel').then(
            (m) => m.CreateChannel,
          ),
      },
      {
        path: 'channel/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/pages/private/channel/channel-view/channel-view').then(
            (m) => m.ChannelView,
          ),
      },
      {
        path: 'my-channel',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/routes/channel.routes').then((m) => m.MyChannelRedirect),
      },
      {
        path: 'edit-channel',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/pages/private/channel/channel-edit/edit-channel').then(
            (m) => m.EditChannel,
          ),
      },
      {
        path: 'upload-video',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/pages/public/video/video-upload/upload-video').then(
            (m) => m.UploadVideo,
          ),
      },
      {
        path: 'edit-video/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/pages/public/video/video-edit/video-edit').then((m) => m.VideoEdit),
      },
      {
        path: 'video/:id',
        loadComponent: () =>
          import('./features/pages/public/video/video-view/video-view').then((m) => m.VideoView),
      },
      {
        path: 'preferences',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/pages/private/preferences/user-preferences').then(
            (m) => m.UserPreferences,
          ),
      },
      {
        path: 'communities',
        loadChildren: () =>
          import('./features/routes/community.routes').then(m => m.communityRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
