import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideoDto } from '../../../features/interfaces/private/video.interface';
import { AuthService } from '../../../features/services/auth/auth.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-card.html',
  styleUrl: './video-card.scss'
})
export class VideoCard {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly video = input.required<VideoDto>();

  onClick(): void {
    this.router.navigate(['/video', this.video().videoId]);
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}