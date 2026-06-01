import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs';

import { VideoService } from '../../../../services/video/video.service';
import { StorageServiceVid } from '../../../../services/models/storage.service';
import { ChannelStateService } from '../../../../services/models/channel-state.service';

@Component({
  selector: 'app-video-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './video-edit.html',
  styleUrl: '../video-upload/upload-video.scss',
})
export class VideoEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly videoService = inject(VideoService);
  private readonly storageService = inject(StorageServiceVid);
  private readonly channelState = inject(ChannelStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(false);
  uploadingThumb = signal(false);
  error = signal('');
  thumbPreview = signal<string | null>(null);

  videoId: string | null = null;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    thumbnailUrl: ['', [Validators.required]],
    videoAccessibilityId: [1, [Validators.required]],
  });

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id');

    if (!this.videoId) {
      this.error.set('Video no encontrado');
      return;
    }

    this.loadVideo(this.videoId);
  }

  private loadVideo(id: string): void {
    this.videoService.getById(id).subscribe({
      next: (video) => {
        this.form.patchValue({
          title: video.title,
          description: video.description ?? '',
          thumbnailUrl: video.thumbnailUrl,
          videoAccessibilityId: video.videoAccessibilityId,
        });

        this.thumbPreview.set(video.thumbnailUrl);
      },
      error: () => this.error.set('No se pudo cargar el video'),
    });
  }

  onThumbSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.thumbPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploadingThumb.set(true);

    this.storageService
      .uploadImage(file)
      .pipe(finalize(() => this.uploadingThumb.set(false)))
      .subscribe({
        next: (url) => this.form.patchValue({ thumbnailUrl: url }),
        error: () => this.error.set('No se pudo subir el thumbnail'),
      });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.videoId) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload = this.form.getRawValue();

    this.videoService
      .update(this.videoId, payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.goBack();
        },
        error: (err) => this.error.set(err?.error?.message ?? 'No se pudo actualizar el video'),
      });
  }

  goBack(): void {
    this.router.navigate(['/video', this.videoId]);
  }
}
