import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';
import { VideoDto, VideoListResponse } from '../../interfaces/private/video.interface';
import { ApiResponse } from '../../interfaces/public/api-response.interface';

@Injectable({ providedIn: 'root' })
export class AdminVideoService {
    private readonly http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/Video`;

    getAll(title?: string, limit = 20, offset = 0): Observable<VideoDto[]> {
        let params = new HttpParams()
        .set('Limit',  limit.toString())
        .set('Offset', offset.toString());
        if (title) params = params.set('Title', title);
        return this.http.get<VideoListResponse>(this.base, { params })
        .pipe(map(r => r.data));
    }

    //eliminar video por id
    delete(id: string): Observable<boolean> {
        return this.http.delete<ApiResponse<boolean>>(`${this.base}/${id}`)
        .pipe(map(r => r.data));
    }
}