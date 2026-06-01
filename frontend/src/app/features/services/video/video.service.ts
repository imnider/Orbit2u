import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';
import { CreateVideoRequest, UpdateVideoRequest, VideoDto, VideoListResponse } from '../../interfaces/private/video.interface';
import { ApiResponse } from '../../interfaces/public/api-response.interface';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/Video`;

  //videos del usuario autenticado
  getMyVideos(): Observable<VideoDto[]> {
    return this.http
      .get<VideoListResponse>(`${this.base}/me`)
      .pipe(map(r => r.data));
  }

  //crear video
  create(payload: CreateVideoRequest): Observable<VideoDto> {
    return this.http
      .post<ApiResponse<VideoDto>>(this.base, payload)
      .pipe(map(r => r.data));
  }

  //actualizar video
  update(id: string, payload: UpdateVideoRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }
}