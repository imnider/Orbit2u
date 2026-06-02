import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { finalize, Observable } from 'rxjs';

import { VideoService } from '../../../../services/video/video.service';
import { StorageServiceVid } from '../../../../services/models/storage.service';
import { ChannelStateService } from '../../../../services/models/channel-state.service';

@Component({
  selector: 'app-video-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './video-form.html',
  styleUrl: './video-form.scss',
})
export class VideoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly videoService = inject(VideoService);
  private readonly storageService = inject(StorageServiceVid);
  private readonly channelState = inject(ChannelStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // estado
  loading = signal(false);
  uploadingThumb = signal(false);
  error = signal('');
  thumbPreview = signal<string | null>(null);

  videoId: string | null = null;

  isEditMode = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    thumbnailUrl: ['', [Validators.required]],
    videoUrl: [''], // solo requerido en create (no en edit)
    videoAccessibilityId: [1, [Validators.required]],
    ageRestriction: [false],
  });

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id');

    if (this.videoId) {
      this.isEditMode.set(true);
      this.loadVideo(this.videoId);
    } else {
      this.isEditMode.set(false);
    }
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
        error: () => this.error.set('No se pudo subir la miniatura'),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload = this.form.getRawValue();

    const request$: Observable<any> = this.isEditMode()
      ? this.videoService.update(this.videoId!, payload)
      : this.videoService.create({
          ...payload,
          durationSeconds: 0,
          communityId: null,
        });

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (video: any) => {
        this.goBack();
      },
      error: (err) => this.error.set(err?.error?.message ?? 'Error al guardar video'),
    });
  }

  goBack(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/video', this.videoId]);
    } else {
      const channelId = this.channelState.channel()?.channelId;
      this.router.navigate(['/channel', channelId]);
    }
  }
}
