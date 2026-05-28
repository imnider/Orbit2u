import {Injectable, computed, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { TokenService } from './token.service';
import { environment } from '../../../../environment/environment';
import { JwtPayload } from '../../interfaces/public/jwt.interface';
import { LoginRequest, LoginResponse } from '../../interfaces/public/login.interface';
import { ApiResponse } from '../../interfaces/public/api-response.interface';
import { RegisterRequest, RegisterResponse } from '../../interfaces/public/register.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly API = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  //uso de signal
  private _token = signal<string | null>(this.tokenService.getToken());

  token = computed(() => this._token());

  payload = computed<JwtPayload | null>(() => {
    const token = this._token();

    if (!token) {
      return null;
    }
    return this.tokenService.decodeToken(token);
  });

  isAuthenticated = computed(() => {
    const token = this._token();

    if (!token) {
      return false;
    }
    return !this.tokenService.isTokenExpired(token);
  });

  //inicio de sesión
  login(credentials: LoginRequest) {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API}/auth/login`, credentials).pipe(
      tap((res) => {
        this.saveSession(
          res.data.token,
          res.data.refreshToken
        );
      })
    );
  }

  //registrarse
  register(data: RegisterRequest) {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.API}/auth/register`, data).pipe(
      tap((res) => {

        this.saveSession(
          res.data.token,
          res.data.refreshToken
        );
      })
    );
  }

  //cerrar sesión
  logout(): void {
    this.tokenService.removeTokens();
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  //herlpers
  getToken(): string | null {
    return this._token();
  }

  private saveSession(
    token: string,
    refreshToken: string
  ): void {

    this.tokenService.saveToken(token);
    this.tokenService.saveRefreshToken(refreshToken);
    this._token.set(token);
  }
}