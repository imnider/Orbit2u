import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { ChannelService } from '../../../../services/models/channel.service';
import { StorageServiceVid } from '../../../../services/models/storage.service';
import { ChannelDto, UpdateChannelRequest } from '../../../../interfaces/private/channel.interface';
import { getFieldError } from '../../../../../shared/utils/form-error';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './edit-channel.html',
  styleUrl: './edit-channel.scss',
})
export class EditChannel implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly channelService = inject(ChannelService);
  private readonly storageService = inject(StorageServiceVid);
  private readonly router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  uploadingAvatar = signal(false);
  uploadingBanner = signal(false);
  error = signal('');
  success = signal('');
  channel = signal<ChannelDto | null>(null);
  avatarPreview = signal<string | null>(null);
  bannerPreview = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    handle: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
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

  ngOnInit(): void {
    this.form.get('handle')?.disable();
    this.channelService
      .getMe()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (ch) => {
          this.channel.set(ch);
          this.avatarPreview.set(ch.avatarURL);
          this.bannerPreview.set(ch.bannerURL);
          this.form.patchValue({
            handle: ch.handle,
            displayName: ch.displayName,
            description: ch.description ?? '',
            avatarUrl: ch.avatarURL ?? '',
            bannerUrl: ch.bannerURL ?? '',
          });
        },
        error: () => this.error.set('No se pudo cargar el canal'),
      });
  }

  getErrorMessage(controlName: string): string {
    return getFieldError(this.form.get(controlName));
  }

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

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    const { handle, displayName, description, avatarUrl, bannerUrl } = this.form.getRawValue();
    const payload: UpdateChannelRequest = {
      handle,
      displayName,
      description: description || null,
      avatarUrl: avatarUrl || null,
      bannerUrl: bannerUrl || null,
    };

    this.channelService
      .update(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (ch) => {
          this.success.set('Canal actualizado correctamente');
          //redigir al canal
          setTimeout(() => this.router.navigate(['/channel', ch.channelId]), 1000);
        },
        error: (err) => this.error.set(err?.error?.message ?? 'No se pudo actualizar el canal'),
      });
  }

  goBack(): void {
    const chan = this.channel();
    if (chan) this.router.navigate(['/channel', chan.channelId]);
    else this.router.navigate(['/my-channel']);
  }
}
