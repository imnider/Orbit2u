import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject, finalize, switchMap } from 'rxjs';

import { CommunityDto } from '../../../../features/interfaces/private/community.interface';
import { CommunityService } from '../../../../features/services/models/community.service'; // ajusta el path

@Component({
  selector: 'app-admin-communities',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './admin-communities.html',
  styleUrl: './admin-communities.scss',
})
export class AdminCommunities implements OnInit {
  private readonly communityService = inject(CommunityService);
  private readonly search$ = new Subject<string>();

  loading = signal(true);
  deleting = signal<string | null>(null);
  communities = signal<CommunityDto[]>([]);
  searchQuery = signal('');
  confirmDeleteId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCommunities();
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((q) => {
          this.loading.set(true);
          return this.communityService
            .getAll(q || undefined, 50, 0)
            .pipe(finalize(() => this.loading.set(false)));
        }),
      )
      .subscribe({ next: (c) => this.communities.set(c) });
  }

  private loadCommunities(): void {
    this.communityService
      .getAll(undefined, 50, 0)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (c) => this.communities.set(c) });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.search$.next(query);
  }

  requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }
  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (!id) return;

    this.deleting.set(id);
    this.communityService
      .delete(id)
      .pipe(
        finalize(() => {
          this.deleting.set(null);
          this.confirmDeleteId.set(null);
        }),
      )
      .subscribe({
        next: () => this.communities.update((list) => list.filter((c) => c.communityId !== id)),
        error: (err) => alert(err?.error?.message ?? 'No se pudo eliminar la comunidad'),
      });
  }
}
