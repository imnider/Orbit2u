import { Routes } from '@angular/router';

export const plansRoutes: Routes = [
  {
    path: 'membership',
    loadComponent: () =>
      import('../pages/public/plans/membership-plan/membership-plan').then(m => m.MembershipPlan),
  },
  {
    path: 'coins',
    loadComponent: () =>
      import('../pages/public/plans/coin-package/coin-package').then(m => m.CoinPackage),
  },
];