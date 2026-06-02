import { Component, OnInit, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, forkJoin, of } from 'rxjs';
import { TagService } from '../../../../features/services/video/tag.service';
import { TagPreferencesService } from '../../../../features/services/video/tag-preference.service';
import { TagDto } from '../../../../features/interfaces/public/tag.interface';

export type TagDialogMode = 'preferences' | 'video';

export interface TagDialogData {
  mode: TagDialogMode;
  videoId?: string;
  selectedTagIds?: string[];
}

const MAX_DISPLAY = 20;

@Component({
  selector: 'app-tag-selector-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tag-dialog.html',
  styleUrl: './tag-dialog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TagSelectorDialog implements OnInit {
  private readonly tagService = inject(TagService);
  private readonly tagPrefs = inject(TagPreferencesService);
  private readonly ref = inject(MatDialogRef<TagSelectorDialog>, { optional: true });
  readonly data = inject<TagDialogData>(MAT_DIALOG_DATA, { optional: true });

  loading = signal(true);
  tags = signal<TagDto[]>([]);

  // para modo video: set local de ids seleccionados
  private localSelected = new Set<string>();

  ngOnInit(): void {
    if (this.data?.mode === 'video' && this.data.selectedTagIds) {
      this.localSelected = new Set(this.data.selectedTagIds);
    }

    this.tagService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (all) => this.tags.set(all.slice(0, MAX_DISPLAY)),
        error: () => this.loading.set(false),
      });
  }

  isSelected(tagId: string): boolean {
    if (this.data?.mode === 'video') {
      return this.localSelected.has(tagId);
    }
    return this.tagPrefs.isSelected(tagId);
  }

  toggle(tag: TagDto): void {
    if (this.data?.mode === 'video') {
      if (this.localSelected.has(tag.tagId)) {
        this.localSelected.delete(tag.tagId);
      } else {
        this.localSelected.add(tag.tagId);
      }
      this.tags.set([...this.tags()]);
      return;
    }

    this.tagPrefs.toggle(tag).subscribe();
  }

  confirm(): void {
    if (this.data?.mode === 'video') {
      this.ref?.close(Array.from(this.localSelected));
      return;
    }

    this.tagPrefs.markDialogShown();
    this.ref?.close();
  }

  skip(): void {
    if (this.data?.mode === 'video') {
      this.ref?.close(undefined);
      return;
    }

    this.tagPrefs.markDialogShown();
    this.ref?.close();
  }
}
