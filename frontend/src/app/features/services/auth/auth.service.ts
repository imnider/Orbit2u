import {Injectable, computed, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { TokenService } from './token.service';
import { environment } from '../../../../environment/environment';
import { JwtPayload } from '../../interfaces/public/jwt.interface';
import { LoginRequest, LoginResponse } from '../../interfaces/public/login.interface';
import { ApiResponse } from '../../interfaces/public/api-response.interface';
import { CLAIMS } from '../../../shared/constants/claims.constants';
import { CompleteRegisterRequest, CompleteRegisterResponse, ValidateTokenResponse } from '../../interfaces/public/register.interface';

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

  // leer el rol usando el claim
  role = computed<string | null>(() => {
    const p = this.payload();
    if (!p) return null;
    return (p as any)[CLAIMS.ROLE] ?? null;
  });

  userId = computed<string | null>(() => this.payload()?.UserId ?? null);

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

  //cerrar sesión
  logout(): void {
    this.tokenService.removeTokens();
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  // registro: pasos
  registerInit(email: string) {
    return this.http.post<ApiResponse<null>>(
      `${this.API}/auth/register/init`,
      { email }
    );
  }
 
  validateRegisterToken(token: string) {
    return this.http.get<ApiResponse<ValidateTokenResponse>>(
      `${this.API}/auth/register/validate/${token}`
    );
  }
 
  completeRegister(token: string, data: CompleteRegisterRequest) {
    return this.http
      .post<ApiResponse<CompleteRegisterResponse>>(
        `${this.API}/auth/register/complete/${token}`,
        data
      ).pipe(tap((res) => this.saveSession(res.data.token, res.data.refreshToken)));
  }

  // helpers
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

  verifyEmail(email: string) {
    return this.http.post<ApiResponse<any>>(`${this.API}/auth/register/init`, {email});
  }

  getCurrentUser(): JwtPayload | null {
    return this.payload();
  }
}