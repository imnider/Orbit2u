import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';

import { PlansService } from '../../../../services/models/plans.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { PurchaseDialog } from '../../../../../shared/components/purchase-dialog/purchase-dialog';
import { MembershipPlanDto } from '../../../../interfaces/private/plans.interface';

@Component({
  selector: 'app-membership-plans',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, PurchaseDialog],
  templateUrl: './membership-plan.html',
  styleUrl: './membership-plan.scss',
})
export class MembershipPlan implements OnInit {
  private readonly plansService = inject(PlansService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(true);
  plans = signal<MembershipPlanDto[]>([]);

  selectedPlan = signal<MembershipPlanDto | null>(null);

  ngOnInit(): void {
    this.plansService.getAllMembershipPlans()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (p) => this.plans.set(p),
        error: () => this.loading.set(false),
      });
  }

  choosePlan(plan: MembershipPlanDto): void {
    if (plan.monthlyPrice === 0) return;
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/planes/membership' } });
      return;
    }
    this.selectedPlan.set(plan);
  }

  closeDialog(): void {
    this.selectedPlan.set(null);
  }

  isFree(plan: MembershipPlanDto): boolean {
    return plan.monthlyPrice === 0;
  }
}