import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import {
  TagSelectorDialog,
  TagDialogData,
} from '../../../../shared/components/tag/tag-dialog/tag-dialog';
import { TagFilterBar } from '../../../../shared/components/tag/tag-filter/tag-filter';
import { VideoCard } from '../../../../shared/components/video-card/video-card';
import { VideoService } from '../../../services/video/video.service';
import { TagPreferencesService } from '../../../services/video/tag-preference.service';
import { VideoDto } from '../../../interfaces/private/video.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TagFilterBar, VideoCard, MatIconModule, MatTooltipModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly videoService = inject(VideoService);
  private readonly dialog = inject(MatDialog);
  readonly tagPrefs = inject(TagPreferencesService);
  private readonly authService = inject(AuthService);

  loading = signal(true);
  allVideos = signal<VideoDto[]>([]);
  activeTagId = signal<string | null>(null);

  readonly isLoggedIn = this.authService.isAuthenticated;

  filteredVideos = computed(() => {
    const tagId = this.activeTagId();
    const videos = this.allVideos();
    const filtered = tagId ? videos.filter((v) => v.tags?.some((t) => t.tagId === tagId)) : videos;
    return [...filtered].sort(() => Math.random() - 0.5);
  });

  constructor() {
    effect(() => {
      const ids = this.tagPrefs.selectedTagIds();
      if (ids.length === 0) {
        this.activeTagId.set(null);
      } else if (this.activeTagId() && !ids.includes(this.activeTagId()!)) {
        this.activeTagId.set(null);
      }
    });
  }

  ngOnInit(): void {
    if (!this.authService.userId() && !this.tagPrefs.dialogShown) {
      this.openTagDialog();
    }
    this.loadVideos();
  }

  private loadVideos(): void {
    this.videoService
      .getAll(undefined, 30, 0)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (videos) => this.allVideos.set(videos),
        error: () => this.loading.set(false),
      });
  }

  onTagSelected(tagId: string | null): void {
    this.activeTagId.set(tagId);
  }

  openTagDialog(): void {
    const ref = this.dialog.open(TagSelectorDialog, {
      data: { mode: 'preferences' } satisfies TagDialogData,
    });

    ref.afterClosed().subscribe();
  }

  getActiveTagName(): string {
    const id = this.activeTagId();
    return this.tagPrefs.selectedTags().find((t) => t.tagId === id)?.displayName ?? '';
  }
}
