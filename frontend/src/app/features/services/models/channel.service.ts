import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';
import { ChannelDto, ChannelListResponse, ChannelResponse, CreateChannelRequest, UpdateChannelRequest } from '../../interfaces/private/channel.interface';
import { ApiResponse } from '../../interfaces/public/api-response.interface';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/Channel`;

  //obtener canal por id
  getById(id: string): Observable<ChannelDto> {
    return this.http
      .get<ChannelResponse>(`${this.base}/${id}`)
      .pipe(map(r => r.data));
  }

  //obtener todos los canales (con filtro opcional)
  getAll(displayName?: string, limit = 20, offset = 0): Observable<ChannelDto[]> {
    let params = new HttpParams()
      .set('Limit',  limit.toString())
      .set('Offset', offset.toString());
    if (displayName) params = params.set('DisplayName', displayName);
    return this.http
      .get<ChannelListResponse>(this.base, { params })
      .pipe(map(r => r.data));
  }

  //crear canal del usuario logueado
  create(payload: CreateChannelRequest): Observable<ChannelDto> {
    return this.http
      .post<ChannelResponse>(this.base, payload)
      .pipe(map(r => r.data));
  }

  //actualizar canal del usuario logueado
  update(payload: UpdateChannelRequest): Observable<ChannelDto> {
    return this.http
      .put<ChannelResponse>(this.base, payload)
      .pipe(map(r => r.data));
  }

  //borrar canal por id
  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.base}/${id}`)
      .pipe(map(r => r.data));
  }
}