import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { finalize, forkJoin, Observable, of, switchMap } from 'rxjs';

import { VideoService } from '../../../../services/video/video.service';
import { StorageServiceVid } from '../../../../services/models/storage.service';
import { ChannelStateService } from '../../../../services/models/channel-state.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../../shared/components/confirm-delete/confirm-delete';
import { MatDialog } from '@angular/material/dialog';
import {
  TagDialogData,
  TagSelectorDialog,
} from '../../../../../shared/components/tag/tag-dialog/tag-dialog';
import { TagService } from '../../../../services/video/tag.service';

@Component({
  selector: 'app-video-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './video-form.html',
  styleUrl: './video-form.scss',
})
export class VideoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly videoService = inject(VideoService);
  private readonly storageService = inject(StorageServiceVid);
  private readonly channelState = inject(ChannelStateService);
  private readonly tagService = inject(TagService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  loading = signal(false);
  uploadingThumb = signal(false);
  uploadingVideo = signal(false);
  error = signal('');
  thumbPreview = signal<string | null>(null);
  originalTagIds = signal<string[]>([]);

  videoId: string | null = null;
  isEditMode = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    thumbnailUrl: ['', [Validators.required]],
    videoUrl: [''],
    videoAccessibilityId: [1, [Validators.required]],
    ageRestriction: [false],
    durationSeconds: [0],
    tags: [[] as string[]],
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
          tags: video.tags?.map((t: any) => t.tagId) ?? [],
        });
        this.originalTagIds.set(video.tags?.map((t) => t.tagId) ?? []);
        this.thumbPreview.set(video.thumbnailUrl);
      },
      error: () => this.error.set('No se pudo cargar el video'),
    });
  }

  onVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingVideo.set(true);
    this.error.set('');

    this.getVideoDuration(file).then((duration) => {
      this.storageService
        .uploadVideo(file)
        .pipe(finalize(() => this.uploadingVideo.set(false)))
        .subscribe({
          next: (url) => this.form.patchValue({ videoUrl: url, durationSeconds: duration }),
          error: () => this.error.set('No se pudo subir el video'),
        });
    });
  }

  private getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const videoEl = document.createElement('video');
      const url = URL.createObjectURL(file);

      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(Math.round(videoEl.duration));
      };

      videoEl.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };

      videoEl.src = url;
      videoEl.load();
    });
  }

  onThumbSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.thumbPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploadingThumb.set(true);
    this.error.set('');

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

    const { tags, ...videoPayload } = this.form.getRawValue();
    const selectedTags: string[] = tags ?? [];

    if (this.isEditMode()) {
      const original = this.originalTagIds();
      const toAdd = selectedTags.filter((id) => !original.includes(id));
      const toRemove = original.filter((id) => !selectedTags.includes(id));

      const addCalls$ = toAdd.map((tagId) => this.tagService.addToVideo(this.videoId!, tagId));
      const removeCalls$ = toRemove.map((tagId) =>
        this.tagService.removeFromVideo(this.videoId!, tagId),
      );

      const updateVideo$ = this.videoService.update(this.videoId!, videoPayload);

      forkJoin([updateVideo$, ...addCalls$, ...removeCalls$])
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => this.goBack(),
          error: (err) => this.error.set(err?.error?.message ?? 'Error al guardar video'),
        });
    } else {
      this.videoService
        .create({ ...videoPayload, communityId: null })
        .pipe(
          switchMap((video) => {
            if (selectedTags.length === 0) return of(null);
            const addCalls$ = selectedTags.map((tagId) =>
              this.tagService.addToVideo(video.videoId, tagId),
            );
            return forkJoin(addCalls$);
          }),
          finalize(() => this.loading.set(false)),
        )
        .subscribe({
          next: () => this.goBack(),
          error: (err) => this.error.set(err?.error?.message ?? 'Error al guardar video'),
        });
    }
  }

  goBack(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/video', this.videoId]);
    } else {
      const channelId = this.channelState.channel()?.channelId;
      this.router.navigate(['/channel', channelId]);
    }
  }

  onDelete(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { entity: 'video' } satisfies ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.loading.set(true);
      this.error.set('');

      this.videoService
        .delete(this.videoId!)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            const channelId = this.channelState.channel()?.channelId;
            this.router.navigate(['/channel', channelId]);
          },
          error: (err) => this.error.set(err?.error?.message ?? 'Error al eliminar el video'),
        });
    });
  }

  openTagsDialog(): void {
    const currentTags: string[] = this.form.getRawValue().tags ?? [];

    const ref = this.dialog.open(TagSelectorDialog, {
      data: {
        mode: 'video',
        videoId: this.videoId ?? undefined,
        selectedTagIds: currentTags,
      } satisfies TagDialogData,
    });

    ref.afterClosed().subscribe((result: string[] | undefined) => {
      if (result !== undefined) {
        this.form.patchValue({ tags: result });
      }
    });
  }
}
