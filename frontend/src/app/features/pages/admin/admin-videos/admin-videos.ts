import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject, finalize, switchMap } from 'rxjs';

import { VideoDto } from '../../../../features/interfaces/private/video.interface';
import { AdminVideoService } from '../../../services/admin/admin-video.service';

@Component({
  selector: 'app-admin-videos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './admin-videos.html',
  styleUrl: './admin-videos.scss'
})
export class AdminVideos implements OnInit {
  private readonly adminVideoService = inject(AdminVideoService);
  private readonly search$ = new Subject<string>();

  loading         = signal(true);
  deleting        = signal<string | null>(null);
  videos          = signal<VideoDto[]>([]);
  searchQuery     = signal('');
  confirmDeleteId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadVideos();
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => {
        this.loading.set(true);
        return this.adminVideoService.getAll(q || undefined, 50, 0)
          .pipe(finalize(() => this.loading.set(false)));
      })
    ).subscribe({ next: (v) => this.videos.set(v) });
  }

  private loadVideos(): void {
    this.adminVideoService.getAll(undefined, 50, 0)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (v) => this.videos.set(v) });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.search$.next(query);
  }

  formatDuration(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  requestDelete(id: string): void { this.confirmDeleteId.set(id); }
  cancelDelete():  void { this.confirmDeleteId.set(null); }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (!id) return;

    this.deleting.set(id);
    this.adminVideoService.delete(id)
      .pipe(finalize(() => { this.deleting.set(null); this.confirmDeleteId.set(null); }))
      .subscribe({
        next: () => this.videos.update(list => list.filter(v => v.videoId !== id)),
        error: (err) => alert(err?.error?.message ?? 'No se pudo eliminar el video'),
      });
  }
}