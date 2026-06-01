import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin, finalize } from 'rxjs';
import { ChannelService } from '../../../../services/models/channel.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { ChannelDto } from '../../../../interfaces/private/channel.interface';
import { VideoDto } from '../../../../interfaces/private/video.interface';

type ChannelTab = 'videos' | 'comunidad' | 'playlist';

@Component({
  selector: 'app-channel-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './channel-view.html',
  styleUrl: './channel-view.scss'
})
export class ChannelView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly channelService = inject(ChannelService);
  private readonly authService = inject(AuthService);

  loading = signal(true);
  error = signal('');
  channel = signal<ChannelDto | null>(null);
  videos = signal<VideoDto[]>([]);
  activeTab = signal<ChannelTab>('videos');

  //determina si el canal visitado es del usuario logueado
  isOwner = computed(() => {
    const userId = this.authService.userId();
    return !!userId && this.channel()?.userId === userId;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Canal no encontrado');
      this.loading.set(false);
      return;
    }
    this.loadChannel(id);
  }

  private loadChannel(id: string): void {
    forkJoin({
      channel: this.channelService.getById(id),
      videos:  this.channelService.getVideos(id),
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: ({ channel, videos }) => {
        this.channel.set(channel);
        this.videos.set(videos);
      },
      error: () => this.error.set('No se pudo cargar el canal'),
    });
  }

  setTab(tab: ChannelTab): void {
    this.activeTab.set(tab);
  }

  //formato de duración mm:ss
  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onUploadVideo(): void {
    this.router.navigate(['/upload-video']);
  }

  onEditChannel(): void {
    this.router.navigate(['/edit-channel']);
  }
}