import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../interfaces/public/api-response.interface';
import { ChangePasswordRequest, CurrentUser, MeResponse, UpdateUserRequest } from '../../interfaces/public/user.interface';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  //info del usuario logueado
  getMe(): Observable<CurrentUser> {
    return this.http.get<ApiResponse<CurrentUser>>(`${this.base}/Users/me`).pipe(
      map(response => response.data)
    );
  }

  //actualizar datos del usuario
  updateUser(userId: string, data: UpdateUserRequest) {
    return this.http.put<ApiResponse<CurrentUser>>(
      `${this.base}/Users/${userId}`, data
    );
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.post<ApiResponse<null>>(
      `${this.base}/Auth/changePassword`, data
    );
  }
}