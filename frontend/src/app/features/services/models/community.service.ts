import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';

import { CommunityDto, CommunityListResponse, CommunityResponse, CreateCommunityRequest, UpdateCommunityRequest} from '../../interfaces/private/community.interface';
import { VideoDto, VideoListResponse } from '../../interfaces/private/video.interface';

@Injectable({ providedIn: 'root' })
export class CommunityService {
    private readonly http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/Community`;

    getAll(name?: string, limit = 20, offset = 0): Observable<CommunityDto[]> {
        let params = new HttpParams() .set('Limit',  limit.toString()) .set('Offset', offset.toString());
        if (name) params = params.set('Name', name);
        return this.http .get<CommunityListResponse>(this.base, { params })
        .pipe(map(r => r.data));
    }

    getById(id: string): Observable<CommunityDto> {
        return this.http .get<CommunityResponse>(`${this.base}/${id}`)
        .pipe(map(r => r.data));
    }

    //comunidades donde soy dueño
    getMyOwned(): Observable<CommunityDto[]> {
        return this.http .get<CommunityListResponse>(`${this.base}/me`)
        .pipe(map(r => r.data));
    }

    //comunidades donde soy miembro
    getMemberships(): Observable<CommunityDto[]> {
        return this.http
        .get<CommunityListResponse>(`${this.base}/memberships`)
        .pipe(map(r => r.data));
    }

    getVideos(communityId: string): Observable<VideoDto[]> {
        return this.http
        .get<VideoListResponse>(`${this.base}/${communityId}/videos`)
        .pipe(map(r => r.data));
    }

    //CRUD
    create(payload: CreateCommunityRequest): Observable<CommunityDto> {
        return this.http.post<CommunityResponse>(this.base, payload)
        .pipe(map(r => r.data));
    }

    update(id: string, payload: UpdateCommunityRequest): Observable<CommunityDto> {
        return this.http.put<CommunityResponse>(`${this.base}/${id}`, payload)
        .pipe(map(r => r.data));
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.base}/${id}`);
    }

    // unirse
    join(id: string): Observable<void> {
        return this.http.post<void>(`${this.base}/${id}/join`, {});
    }

    // salir
    leave(id: string): Observable<void> {
        return this.http.delete<void>(`${this.base}/${id}/leave`);
    }
}