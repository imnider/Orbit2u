import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { StorageService } from './storage.service';
import { environment } from '../../../../environment/environment';
import { JwtPayload } from '../../interfaces/public/jwt.interface';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;
  private readonly storageService = inject(StorageService);

  saveToken(token: string): void {
    this.storageService.set(this.TOKEN_KEY, token);
  }

  saveRefreshToken(refreshToken: string): void {
    this.storageService.set(
      this.REFRESH_TOKEN_KEY,
      refreshToken
    );
  }

  getToken(): string | null {
    return this.storageService.get(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storageService.get(this.REFRESH_TOKEN_KEY);
  }

  removeTokens(): void {
    this.storageService.remove(this.TOKEN_KEY);
    this.storageService.remove(this.REFRESH_TOKEN_KEY);
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    }
    catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }
}