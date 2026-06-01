import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';
import { TagDto, TagListResponse } from '../../interfaces/public/tag.interface';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/Tag`;

  //obtener todos los tags disponibles
  getAll(): Observable<TagDto[]> {
    return this.http
      .get<TagListResponse>(this.base)
      .pipe(map(r => r.data));
  }

  //asociar tag a un video
  addToVideo(videoId: string, tagId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/Video/${videoId}/tags/${tagId}`, {});
  }

  //desasociar tag de un video
  removeFromVideo(videoId: string, tagId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/Video/${videoId}/tags/${tagId}`);
  }
}