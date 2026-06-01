import { Component, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TagDto } from '../../../../features/interfaces/public/tag.interface';
import { TagPreferencesService } from '../../../../features/services/video/tag-preference.service';

@Component({
  selector: 'app-tag-filter-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tag-filter.html',
  styleUrl: './tag-filter.scss'
})
export class TagFilterBar {
  private readonly tagPrefs = inject(TagPreferencesService);

  //tag activo recibido
  readonly activeTagId = input<string | null>(null);

  //tagId seleccionado (null=todos)
  readonly tagSelected = output<string | null>();

  get preferredTags(): TagDto[] {
    return this.tagPrefs.selectedTags();
  }

  select(tagId: string | null): void {
    this.tagSelected.emit(tagId);
  }
}