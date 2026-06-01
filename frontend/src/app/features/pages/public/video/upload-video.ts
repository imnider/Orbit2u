import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { VideoService } from '../../../services/video/video.service';
import { StorageServiceVid } from '../../../services/models/storage.service';
import { ChannelStateService } from '../../../services/models/channel-state.service';
import { CreateVideoRequest } from '../../../interfaces/private/video.interface';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './upload-video.html',
  styleUrl: './upload-video.scss'
})
export class UploadVideo implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly videoService = inject(VideoService);
  private readonly storageService = inject(StorageServiceVid);
  private readonly channelState = inject(ChannelStateService);
  private readonly router = inject(Router);

  loading = signal(false);
  uploadingVideo = signal(false);
  uploadingThumb = signal(false);
  error = signal('');
  videoPreviewUrl = signal<string | null>(null);
  thumbPreview = signal<string | null>(null);
  videoUploadProgress = signal(0);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    videoUrl: ['', [Validators.required]],
    thumbnailUrl: ['', [Validators.required]],
    durationSeconds: [0],
    videoAccessibilityId:[1, [Validators.required]],
    ageRestriction: [false],
  });

  ngOnInit(): void {
    if (!this.channelState.hasChannel()) {
      this.router.navigate(['/create-channel']);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required'])  return 'Este campo es obligatorio';
      if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  //seleccionar archivo
  onVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file); //preview
    this.videoPreviewUrl.set(objectUrl);

    const videoEl = document.createElement('video');
    videoEl.src = objectUrl;
    videoEl.onloadedmetadata = () => {
      const duration = Math.round(videoEl.duration); //lectura de duracion
      this.form.patchValue({ durationSeconds: duration });
      URL.revokeObjectURL(objectUrl);
    };

    //subir a Cloudinary
    this.uploadingVideo.set(true);
    this.storageService.uploadVideo(file)
      .pipe(finalize(() => this.uploadingVideo.set(false)))
      .subscribe({
        next:  (url) => this.form.patchValue({ videoUrl: url }),
        error: () => this.error.set('No se pudo subir el video'),
      });
  }

  //thumbnail
  onThumbSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.thumbPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploadingThumb.set(true);
    this.storageService.uploadImage(file)
      .pipe(finalize(() => this.uploadingThumb.set(false)))
      .subscribe({
        next:  (url) => this.form.patchValue({ thumbnailUrl: url }),
        error: ()    => this.error.set('No se pudo subir el thumbnail'),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { title, description, videoUrl, thumbnailUrl, durationSeconds, videoAccessibilityId, ageRestriction } = this.form.getRawValue();
    const payload: CreateVideoRequest = { title, description: description || null, videoUrl, thumbnailUrl,
                                        durationSeconds, videoAccessibilityId, ageRestriction, communityId: null};

    this.videoService.create(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (video) => {
          const channelId = this.channelState.channel()?.channelId;
          this.router.navigate(['/channel', channelId]);
        },
        error: (err) => this.error.set(err?.error?.message ?? 'No se pudo subir el video'),
      });
  }

  goBack(): void {
    const channelId = this.channelState.channel()?.channelId;
    if (channelId) this.router.navigate(['/channel', channelId]);
    else this.router.navigate(['/my-channel']);
  }

  //formato mm:ss para mostrar duración detectada
  formatDuration(seconds?: number): string {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}