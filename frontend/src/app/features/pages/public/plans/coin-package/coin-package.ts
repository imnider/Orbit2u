// features/pages/public/plans/coin-packages/coin-packages.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { PlansService } from '../../../../services/models/plans.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { PurchaseDialog } from '../../../../../shared/components/purchase-dialog/purchase-dialog';
import { CoinPackageDto } from '../../../../interfaces/private/plans.interface';
import { UserService } from '../../../../services/models/user.service';

@Component({
  selector: 'app-coin-packages',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, PurchaseDialog],
  templateUrl: './coin-package.html',
  styleUrl: './coin-package.scss',
})
export class CoinPackage implements OnInit {
  private readonly plansService = inject(PlansService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  loading = signal(true);
  packages = signal<CoinPackageDto[]>([]);
  userCoins = signal<number>(0);

  selectedPackage = signal<CoinPackageDto | null>(null);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.userService.getMe().subscribe({
        next: (user) => this.userCoins.set(user.coins),
      });
    }
    this.plansService
      .getAllCoinPackages()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (p) => this.packages.set(p),
        error: () => this.loading.set(false),
      });
  }

  choosePack(pack: CoinPackageDto): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/planes/coins' } });
      return;
    }
    this.selectedPackage.set(pack);
  }

  closeDialog(): void {
    this.selectedPackage.set(null);
  }
}
