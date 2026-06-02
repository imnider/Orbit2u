import { Component, OnInit, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { CommunityService } from '../../../../services/models/community.service';
import { StorageServiceVid } from '../../../../services/models/storage.service';
import { CommunityDto } from '../../../../interfaces/private/community.interface';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../../shared/components/confirm-delete/confirm-delete';
import { MatDialog } from '@angular/material/dialog';

export interface CommunityDialogData {
  community?: CommunityDto;
}

@Component({
  selector: 'app-community-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './community-form.html',
  styleUrl: './community-form.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CommunityForm implements OnInit {
  private readonly communityService = inject(CommunityService);
  private readonly storageService = inject(StorageServiceVid);
  private readonly dialog = inject(MatDialog);
  readonly ref = inject(MatDialogRef<CommunityForm>);
  readonly data = inject<CommunityDialogData>(MAT_DIALOG_DATA, { optional: true });

  saving = signal(false);
  error = signal('');
  uploadingAvatar = signal(false);
  uploadingBanner = signal(false);

  name = '';
  description = '';
  avatarUrl = '';
  bannerUrl = '';
  isPrivate = false;

  readonly isEdit = () => !!this.data?.community;

  ngOnInit(): void {
    const c = this.data?.community;
    if (c) {
      this.name = c.name;
      this.description = c.description ?? '';
      this.avatarUrl = c.avatarUrl ?? '';
      this.bannerUrl = c.bannerUrl ?? '';
      this.isPrivate = c.isPrivate;
    }
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingAvatar.set(true);
    this.error.set('');

    this.storageService
      .uploadImage(file)
      .pipe(finalize(() => this.uploadingAvatar.set(false)))
      .subscribe({
        next: (url) => (this.avatarUrl = url),
        error: () => this.error.set('No se pudo subir el avatar'),
      });
  }

  onBannerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingBanner.set(true);
    this.error.set('');

    this.storageService
      .uploadImage(file)
      .pipe(finalize(() => this.uploadingBanner.set(false)))
      .subscribe({
        next: (url) => (this.bannerUrl = url),
        error: () => this.error.set('No se pudo subir el banner'),
      });
  }

  onDelete(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { entity: 'comunidad' } satisfies ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.saving.set(true);
      this.communityService
        .delete(this.data!.community!.communityId)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.ref.close({ deleted: true }),
          error: () => this.error.set('No se pudo eliminar la comunidad'),
        });
    });
  }

  submit(): void {
    if (!this.name.trim()) {
      this.error.set('El nombre es obligatorio');
      return;
    }

    this.error.set('');
    this.saving.set(true);

    const payload = {
      name: this.name.trim(),
      description: this.description.trim() || null,
      avatarUrl: this.avatarUrl.trim() || null,
      bannerUrl: this.bannerUrl.trim() || null,
      isPrivate: this.isPrivate,
    };

    const c = this.data?.community;
    const req$ = c
      ? this.communityService.update(c.communityId, payload)
      : this.communityService.create(payload);

    req$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (result) => this.ref.close({ saved: result }),
      error: () => this.error.set('Ocurrió un error. Inténtalo de nuevo.'),
    });
  }

  close(): void {
    this.ref.close();
  }
}
