import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin, finalize } from 'rxjs';

import { VideoService } from '../../../../services/video/video.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { ChannelService } from '../../../../services/models/channel.service';
import { VideoDto } from '../../../../interfaces/private/video.interface';
import { ChannelDto } from '../../../../interfaces/private/channel.interface';

@Component({
  selector: 'app-video-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './video-view.html',
  styleUrl: './video-view.scss',
})
export class VideoView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly videoService = inject(VideoService);
  private readonly channelService = inject(ChannelService);
  private readonly authService = inject(AuthService);

  loading = signal(true);
  error = signal('');
  video = signal<VideoDto | null>(null);
  channel = signal<ChannelDto | null>(null);
  relatedVideos = signal<VideoDto[]>([]);
  showComments = signal(false);

  liked = signal(false);
  disliked = signal(false);
  saved = signal(false);

  readonly isLoggedIn = this.authService.isAuthenticated;

  readonly isOwner = computed(() => {
    const userId = this.authService.userId();
    return !!userId && this.channel()?.userId === userId;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.error.set('Video no encontrado');
        this.loading.set(false);
        return;
      }

      this.loadVideo(id);
    });
  }

  private loadVideo(id: string): void {
    this.videoService.getById(id).subscribe({
      next: (video) => {
        this.video.set(video);
        forkJoin({
          channel: this.channelService.getById(video.channelId),
          related: this.videoService.getAll(undefined, 4, 0),
        })
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: ({ channel, related }) => {
              this.channel.set(channel);
              this.relatedVideos.set(related.filter((v) => v.videoId !== id));
            },
            error: () => this.loading.set(false),
          });
      },
      error: () => {
        this.error.set('No se pudo cargar el video');
        this.loading.set(false);
      },
    });
  }

  //si no esta autenticado, devuelve al login
  private requireAuth(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return false;
    }
    return true;
  }

  toggleLike(): void {
    if (!this.requireAuth()) return;
    if (this.liked()) {
      this.liked.set(false);
    } else {
      this.liked.set(true);
      this.disliked.set(false);
    }
  }

  toggleDislike(): void {
    if (!this.requireAuth()) return;
    if (this.disliked()) {
      this.disliked.set(false);
    } else {
      this.disliked.set(true);
      this.liked.set(false);
    }
  }

  toggleSave(): void {
    if (!this.requireAuth()) return;
    this.saved.update((v) => !v);
  }

  toggleComments(): void {
    this.showComments.update((v) => !v);
  }

  copyShareUrl(): void {
    navigator.clipboard.writeText(window.location.href);
  }

  goToChannel(): void {
    if (!this.requireAuth()) return;
    const ch = this.channel();
    if (ch) this.router.navigate(['/channel', ch.channelId]);
  }

  goToRelated(videoId: string): void {
    this.router.navigate(['/video', videoId]);
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  goToEdit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.router.navigate(['/video/form', id]);
  }
}
