import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';
import {CurrentUser, UserListResponse, MeResponse, UpdateUserRequest, AddCoinsRequest} from '../../interfaces/public/user.interface';
import { ApiResponse } from '../../interfaces/public/api-response.interface';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
    private readonly http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/Users`;

    getAll(search?: string, limit = 20, offset = 0): Observable<CurrentUser[]> {
        let params = new HttpParams()
        .set('Limit',  limit.toString())
        .set('Offset', offset.toString());
        if (search) params = params.set('UserName', search);
        return this.http.get<UserListResponse>(this.base, { params })
        .pipe(map(r => r.data));
    }

    //obtener usuario por id
    getById(id: string): Observable<CurrentUser> {
        return this.http.get<MeResponse>(`${this.base}/${id}`)
        .pipe(map(r => r.data));
    }

    //actualizar usuario (membresia, rol)
    update(id: string, payload: UpdateUserRequest): Observable<CurrentUser> {
        return this.http.put<MeResponse>(`${this.base}/${id}`, payload)
        .pipe(map(r => r.data));
    }

    //eliminar usuario
    delete(id: string): Observable<boolean> {
        return this.http.delete<ApiResponse<boolean>>(`${this.base}/${id}`)
        .pipe(map(r => r.data));
    }

    //agregar monedas a la billetera
    addCoins(userId: string, coinPackageId: number): Observable<boolean> {
        const payload: AddCoinsRequest = { coinPackageId };
        return this.http.post<ApiResponse<boolean>>(`${this.base}/${userId}/wallet`, payload)
        .pipe(map(r => r.data));
    }
}