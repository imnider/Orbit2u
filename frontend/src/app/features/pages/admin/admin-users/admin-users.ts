import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject, finalize, switchMap } from 'rxjs';
import { AdminUserService } from '../../../services/admin/admin-user.service';
import { MembershipService } from '../../../services/admin/membership.service';
import { CurrentUser, UpdateUserRequest } from '../../../interfaces/public/user.interface';
import { MembershipPlanDto } from '../../../interfaces/private/plans.interface';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminUserService = inject(AdminUserService);
  private readonly membershipService = inject(MembershipService);

  private readonly search$ = new Subject<string>();

  loading = signal(true);
  saving = signal(false);
  deleting = signal<string | null>(null); //id del usuario que se está borrando
  users = signal<CurrentUser[]>([]);
  memberships = signal<MembershipPlanDto[]>([]);
  selectedUser = signal<CurrentUser | null>(null);
  showEditModal = signal(false);
  showCoinsModal = signal(false);
  confirmDeleteId = signal<string | null>(null);
  searchQuery = signal('');
  error = signal('');
  success = signal('');

  editForm = this.fb.nonNullable.group({
    membershipPlanId: [1, [Validators.required]],
  });

  coinsForm = this.fb.nonNullable.group({
    coinPackageId: [1, [Validators.required]],
  });

  //paquetes de monedas disponibles (hardcoded, ajustar si el back los expone)
  readonly coinPackages = [
    { id: 1, label: '100 monedas', amount: 100 },
    { id: 2, label: '500 monedas', amount: 500 },
    { id: 3, label: '1000 monedas', amount: 1000 },
  ];

  ngOnInit(): void {
    this.loadUsers();
    this.loadMemberships();
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((q) => {
          this.loading.set(true);
          return this.adminUserService
            .getAll(q || undefined, 50, 0)
            .pipe(finalize(() => this.loading.set(false)));
        }),
      )
      .subscribe({ next: (u) => this.users.set(u) });
  }

  private loadUsers(): void {
    this.adminUserService
      .getAll(undefined, 50, 0)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (u) => this.users.set(u) });
  }

  private loadMemberships(): void {
    this.membershipService.getAll().subscribe({ next: (m) => this.memberships.set(m) });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.search$.next(query);
  }

  //abrir modal de edición de membresía
  openEditModal(user: CurrentUser): void {
    this.selectedUser.set(user);
    this.editForm.patchValue({ membershipPlanId: user.membershipPlan?.membershipPlanId ?? 1 });
    this.error.set('');
    this.success.set('');
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedUser.set(null);
  }

  saveEdit(): void {
    const user = this.selectedUser();
    if (!user) return;
    this.saving.set(true);
    this.error.set('');
    const payload: UpdateUserRequest = {
      membershipPlanId: this.editForm.getRawValue().membershipPlanId,
    };

    this.adminUserService
      .update(user.userId, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.users.update((list) => list.map((u) => (u.userId === updated.userId ? updated : u)));
          this.success.set('Membresía actualizada');
          setTimeout(() => this.closeEditModal(), 1000);
        },
        error: (err) => this.error.set(err?.error?.message ?? 'Error al actualizar'),
      });
  }

  //modal de monedas
  openCoinsModal(user: CurrentUser): void {
    this.selectedUser.set(user);
    this.error.set('');
    this.success.set('');
    this.showCoinsModal.set(true);
  }

  closeCoinsModal(): void {
    this.showCoinsModal.set(false);
    this.selectedUser.set(null);
  }

  saveCoins(): void {
    const user = this.selectedUser();
    if (!user) return;

    this.saving.set(true);
    this.error.set('');

    const { coinPackageId } = this.coinsForm.getRawValue();
    const coinsToAdd = this.coinPackages.find((p) => p.id === +coinPackageId)?.amount ?? 0;

    this.adminUserService
      .addCoins(user.userId, coinPackageId)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.users.update((list) =>
            list.map((u) => (u.userId === user.userId ? { ...u, coins: u.coins + coinsToAdd } : u)),
          );
          this.success.set('Monedas agregadas correctamente');
          setTimeout(() => this.closeCoinsModal(), 1000);
        },
        error: (err) => this.error.set(err?.error?.message ?? 'Error al agregar monedas'),
      });
  }

  requestDelete(userId: string): void {
    this.confirmDeleteId.set(userId);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (!id) return;

    this.deleting.set(id);
    this.adminUserService
      .delete(id)
      .pipe(
        finalize(() => {
          this.deleting.set(null);
          this.confirmDeleteId.set(null);
        }),
      )
      .subscribe({
        next: () => this.users.update((list) => list.filter((u) => u.userId !== id)),
        error: (err) => alert(err?.error?.message ?? 'No se pudo eliminar el usuario'),
      });
  }
}
