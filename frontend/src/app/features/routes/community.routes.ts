import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
 
export const communityRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/public/communities/communities').then(m => m.Communities),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../pages/private/community/community-view/community-view').then(m => m.CommunityView),
  },
];
