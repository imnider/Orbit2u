// shared/components/tag/tag-dialog/tag-dialog.ts
import { Component, OnInit, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { TagService } from '../../../../features/services/video/tag.service';
import { TagPreferencesService } from '../../../../features/services/video/tag-preference.service';
import { TagDto } from '../../../../features/interfaces/public/tag.interface';

const MAX_DISPLAY = 20;

@Component({
  selector: 'app-tag-selector-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tag-dialog.html',
  styleUrl: './tag-dialog.scss'
})
export class TagSelectorDialog implements OnInit {
  private readonly tagService = inject(TagService);
  readonly tagPrefs = inject(TagPreferencesService);

  readonly closed = output<void>();

  loading = signal(true);
  toggling = signal(false);
  tags = signal<TagDto[]>([]);

  ngOnInit(): void {
    this.tagService.getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (all) => this.tags.set(all.slice(0, MAX_DISPLAY)),
        error: () => this.loading.set(false),
      });
  }

  isSelected(tagId: string): boolean {
    return this.tagPrefs.isSelected(tagId);
  }

  toggle(tag: TagDto): void {
    this.toggling.set(true);
    this.tagPrefs.toggle(tag)
      .pipe(finalize(() => this.toggling.set(false)))
      .subscribe();
  }

  confirm(): void {
    this.tagPrefs.markDialogShown();
    this.closed.emit();
  }

  skip(): void {
    this.tagPrefs.markDialogShown();
    this.closed.emit();
  }
}