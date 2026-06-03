import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { ChannelService } from '../../../../services/models/channel.service';
import { StorageServiceVid } from '../../../../services/models/storage.service';
import { CreateChannelRequest } from '../../../../interfaces/private/channel.interface';
import { getFieldError } from '../../../../../shared/utils/form-error';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './create-channel.html',
  styleUrl: './create-channel.scss',
})
export class CreateChannel {
  private readonly fb = inject(FormBuilder);
  private readonly channelService = inject(ChannelService);
  private readonly storageService = inject(StorageServiceVid);
  private readonly router = inject(Router);

  loading = signal(false);
  uploadingAvatar = signal(false);
  uploadingBanner = signal(false);
  error = signal('');
  avatarPreview = signal<string | null>(null);
  bannerPreview = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    handle: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.pattern(/^[a-z0-9._-]+$/),
      ],
    ],
    displayName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[^\s].*[^\s]$|^[^\s]$/),
      ],
    ],
    description: ['', [Validators.maxLength(255)]],
    avatarUrl: [''],
    bannerUrl: [''],
  });

  getErrorMessage(controlName: string): string {
    return getFieldError(this.form.get(controlName));
  }

  //subida de avatar con preview inmediato
  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploadingAvatar.set(true);
    this.storageService
      .uploadImage(file)
      .pipe(finalize(() => this.uploadingAvatar.set(false)))
      .subscribe({
        next: (url) => this.form.patchValue({ avatarUrl: url }),
        error: () => this.error.set('No se pudo subir el avatar'),
      });
  }

  //subida de banner con preview inmediato
  onBannerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.bannerPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploadingBanner.set(true);
    this.storageService
      .uploadImage(file)
      .pipe(finalize(() => this.uploadingBanner.set(false)))
      .subscribe({
        next: (url) => this.form.patchValue({ bannerUrl: url }),
        error: () => this.error.set('No se pudo subir el banner'),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { handle, displayName, description, avatarUrl, bannerUrl } = this.form.getRawValue();
    const payload: CreateChannelRequest = {
      handle,
      displayName,
      description: description || null,
      avatarUrl: avatarUrl || null,
      bannerUrl: bannerUrl || null,
    };

    this.channelService
      .create(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/my-channel']),
        error: (err) => this.error.set(err?.error?.message ?? 'No se pudo crear el canal'),
      });
  }
}
