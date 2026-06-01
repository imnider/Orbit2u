import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { TagSelectorDialog } from '../../../../shared/components/tag/tag-dialog/tag-dialog';
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
  imports: [CommonModule, TagSelectorDialog, TagFilterBar, VideoCard, MatIconModule, MatTooltipModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  private readonly videoService = inject(VideoService);
  readonly tagPrefs = inject(TagPreferencesService);
  private readonly authService = inject(AuthService);

  loading = signal(true);
  allVideos = signal<VideoDto[]>([]);
  activeTagId = signal<string | null>(null);
  showTagDialog = signal(false);

  readonly isLoggedIn = this.authService.isAuthenticated;

  //mezclado en aleatorio
  filteredVideos = computed(() => {
    const tagId  = this.activeTagId();
    const videos = this.allVideos();
    const filtered = tagId
      ? videos.filter(v => v.tags?.some(t => t.tagId === tagId))
      : videos;
    return [...filtered].sort(() => Math.random() - 0.5);
  });

  ngOnInit(): void {
    if (!this.authService.userId() && !this.tagPrefs.dialogShown) {
      this.showTagDialog.set(true);
    }
    this.loadVideos();
  }

  private loadVideos(): void {
    this.videoService.getAll(undefined, 30, 0)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (videos) => this.allVideos.set(videos),
        error: () => this.loading.set(false),
      });
  }

  onTagSelected(tagId: string | null): void {
    this.activeTagId.set(tagId);
  }

  onDialogClosed(): void {
    this.showTagDialog.set(false);
    if (this.tagPrefs.hasPreferences()) {
      this.activeTagId.set(this.tagPrefs.selectedTagIds()[0]);
    }
  }

  openTagDialog(): void {
    this.showTagDialog.set(true);
  }

  getActiveTagName(): string {
    const id = this.activeTagId();
    return this.tagPrefs.selectedTags().find(t => t.tagId === id)?.displayName ?? '';
  }
}
