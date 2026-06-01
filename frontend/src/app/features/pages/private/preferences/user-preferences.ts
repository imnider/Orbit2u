// features/pages/private/preferences/preferences.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { TagService } from '../../../services/video/tag.service';
import { TagPreferencesService } from '../../../services/video/tag-preference.service';
import { TagDto } from '../../../interfaces/public/tag.interface';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './user-preferences.html',
  styleUrl: './user-preferences.scss',
})
export class UserPreferences implements OnInit {
  private readonly tagService = inject(TagService);
  readonly tagPrefs           = inject(TagPreferencesService);

  loading = signal(true);
  saving  = signal(false);
  allTags = signal<TagDto[]>([]);

  ngOnInit(): void {
    this.tagService.getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tags) => this.allTags.set(tags),
        error: () => this.loading.set(false),
      });
  }

  isSelected(tagId: string): boolean {
    return this.tagPrefs.isSelected(tagId);
  }

  toggle(tag: TagDto): void {
    this.saving.set(true);
    this.tagPrefs.toggle(tag)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe();
  }
}