import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../interfaces/public/api-response.interface';
import { CurrentUser, MeResponse, UpdateUserRequest } from '../../interfaces/public/user.interface';
import { environment } from '../../../../environment/environment';

export type UserResponse = ApiResponse<CurrentUser>;

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/Users`;

  //info del usuario logueado
  getMe(): Observable<CurrentUser> {
    return this.http
      .get<MeResponse>(`${this.base}/me`)
      .pipe(map(r => r.data));
  }

  //actualizar datos del usuario
  update(id: string, payload: UpdateUserRequest): Observable<CurrentUser> {
    return this.http
      .put<UserResponse>(`${this.base}/${id}`, payload)
      .pipe(map(r => r.data));
  }
}