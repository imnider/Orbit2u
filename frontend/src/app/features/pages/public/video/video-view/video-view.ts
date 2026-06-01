import { Component, OnInit, OnDestroy, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  imports: [CommonModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './video-view.html',
  styleUrl: './video-view.scss'
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

  //acciones UI (sin backend aun)
  liked = signal(false);
  disliked = signal(false);
  saved = signal(false);

  //el canal es del usuario logueado
  isOwner = computed(() => {
    const userId = this.authService.userId();
    return !!userId && this.channel()?.userId === userId;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set('Video no encontrado'); this.loading.set(false); return; }
    this.loadVideo(id);
  }

  private loadVideo(id: string): void {
    this.videoService.getById(id)
      .subscribe({
        next: (video) => {
          this.video.set(video);
          //carga canal y videos relacionados en paralelo
          forkJoin({
            channel: this.channelService.getById(video.channelId),
            related: this.videoService.getAll(undefined, 4, 0),
          })
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: ({ channel, related }) => {
              this.channel.set(channel);
              //excluye el video actual de los relacionados
              this.relatedVideos.set(related.filter(v => v.videoId !== id));
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

  toggleLike(): void {
    if (this.liked()) {
      this.liked.set(false);
    } else {
      this.liked.set(true);
      this.disliked.set(false);
    }
  }

  toggleDislike(): void {
    if (this.disliked()) {
      this.disliked.set(false);
    } else {
      this.disliked.set(true);
      this.liked.set(false);
    }
  }

  toggleSave(): void {
    this.saved.update(v => !v);
  }

  toggleComments(): void {
    this.showComments.update(v => !v);
  }

  copyShareUrl(): void {
    navigator.clipboard.writeText(window.location.href);
  }

  goToChannel(): void {
    const ch = this.channel();
    if (ch) this.router.navigate(['/channel', ch.channelId]);
  }

  goToRelated(videoId: string): void {
    //recarga el componente con el nuevo video
    this.router.navigate(['/video', videoId]);
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}