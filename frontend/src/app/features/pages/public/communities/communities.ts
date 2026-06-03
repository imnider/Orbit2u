import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { CommunityService } from '../../../services/models/community.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommunityDto } from '../../../interfaces/private/community.interface';
import { CommunityForm, CommunityDialogData } from '../../private/community/community-form/community-form';
import { UserService } from '../../../services/models/user.service';
import { CurrentUser } from '../../../interfaces/public/user.interface';
import { CommunityAccessCodeService } from '../../../services/priv-community/community-access.service';
import { AccessDialogData, CommunityAccessDialog } from '../../private/community-access/community-access-dialog';



type Tab = 'all' | 'member' | 'owned';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './communities.html',
  styleUrl: './communities.scss',
})
export class Communities implements OnInit {
  private readonly communityService = inject(CommunityService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);

  private readonly accessCodeService = inject(CommunityAccessCodeService);
  
  readonly isLoggedIn = this.authService.isAuthenticated;

  activeTab = signal<Tab>('all');
  searchQuery = signal('');
  loadingAll = signal(true);
  loadingMember = signal(false);
  loadingOwned = signal(false);

  allCommunities = signal<CommunityDto[]>([]);
  memberCommunities = signal<CommunityDto[]>([]);
  ownedCommunities = signal<CommunityDto[]>([]);
  currentUser = signal<CurrentUser | null>(null);

  filteredAll = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allCommunities();
    return this.allCommunities().filter(
      (c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this.loadAll();
    if (this.isLoggedIn()) {
      this.loadMember();
      this.loadOwned();

      this.userService.getMe().subscribe({
        next: (user) => this.currentUser.set(user),
        error: () => {},
      });
    }
  }

  readonly reachedCommunityLimit = computed(() => {
    const user = this.currentUser();

    if (!user) return false;

    return this.ownedCommunities().length >= user.membershipPlan.maxCommunities;
  });

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  private loadAll(): void {
    this.loadingAll.set(true);
    this.communityService
      .getAll(undefined, 50, 0)
      .pipe(finalize(() => this.loadingAll.set(false)))
      .subscribe({ next: (c) => this.allCommunities.set(c), error: () => {} });
  }

  private loadMember(): void {
    this.loadingMember.set(true);
    this.communityService
      .getMemberships()
      .pipe(finalize(() => this.loadingMember.set(false)))
      .subscribe({ next: (c) => this.memberCommunities.set(c), error: () => {} });
  }

  private loadOwned(): void {
    this.loadingOwned.set(true);
    this.communityService
      .getMyOwned()
      .pipe(finalize(() => this.loadingOwned.set(false)))
      .subscribe({ next: (c) => this.ownedCommunities.set(c), error: () => {} });
  }

  goToCommunity(id: string): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/communities/${id}` } });
      return;
    }

    const community = this.currentList().find(c => c.communityId === id);

    if (community?.isPrivate) {
      const isOwner  = community.ownerUserId === this.currentUser()?.userId;
      const isMember = this.memberCommunities().some(c => c.communityId === id);
      const hasAccess = this.accessCodeService.hasAccess(id);

      if (!isOwner && !isMember && !hasAccess) {
        const ref = this.dialog.open(CommunityAccessDialog, {
          width: '380px',
          data: { communityId: id, communityName: community.name } satisfies AccessDialogData,
        });
        ref.afterClosed().subscribe(result => {
          if (result?.granted) {
            this.accessCodeService.grantAccess(id);
            this.router.navigate(['/communities', id]);
          }
        });
        return;
      }
    }

    this.router.navigate(['/communities', id]);
  }

  openCreateDialog(): void {
    if (this.reachedCommunityLimit()) {
      this.router.navigate(['/planes/membership']);
      return;
    }
    const ref = this.dialog.open(CommunityForm, {
      width: '520px',
      data: {} satisfies CommunityDialogData,
    });

    ref.afterClosed().subscribe((result) => {
      if (!result?.saved) return;
      const community: CommunityDto = result.saved;
      this.ownedCommunities.update((list) => [community, ...list]);
      this.allCommunities.update((list) => [community, ...list]);
      this.router.navigate(['/communities', community.communityId]);  // ← solo aquí
    });
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  currentList = computed<CommunityDto[]>(() => {
    switch (this.activeTab()) {
      case 'member':
        return this.memberCommunities();
      case 'owned':
        return this.ownedCommunities();
      default:
        return this.filteredAll();
    }
  });

  currentLoading = computed(() => {
    switch (this.activeTab()) {
      case 'member':
        return this.loadingMember();
      case 'owned':
        return this.loadingOwned();
      default:
        return this.loadingAll();
    }
  });
}
