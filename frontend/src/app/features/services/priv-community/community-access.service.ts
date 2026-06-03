import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

const GRANTED_KEY = 'community_access_granted';

@Injectable({ providedIn: 'root' })
export class CommunityAccessCodeService {
  private readonly authService = inject(AuthService);

  getCode(communityId: string): string {
    // Toma caracteres del UUID en posiciones fijas y los mezcla
    const clean = communityId.replace(/-/g, '').toUpperCase();
    const picks = [0, 4, 8, 12, 16, 20, 24, 28];
    return picks.map(i => clean[i] ?? '0').join('');
  }

  validateCode(communityId: string, input: string): boolean {
    return this.getCode(communityId) === input.trim().toUpperCase();
  }

  grantAccess(communityId: string): void {
    const key = this.buildKey(communityId);
    if (!key) return;
    const granted = this.getGranted();
    granted[key] = true;
    localStorage.setItem(GRANTED_KEY, JSON.stringify(granted));
  }

  hasAccess(communityId: string): boolean {
    const key = this.buildKey(communityId);
    if (!key) return false;
    return !!this.getGranted()[key];
  }

  revokeAccess(communityId: string): void {
    const key = this.buildKey(communityId);
    if (!key) return;
    const granted = this.getGranted();
    delete granted[key];
    localStorage.setItem(GRANTED_KEY, JSON.stringify(granted));
  }

  private buildKey(communityId: string): string | null {
    const userId = this.authService.userId();
    if (!userId) return null;
    return `${userId}:${communityId}`;
  }

  private getGranted(): Record<string, boolean> {
    try { return JSON.parse(localStorage.getItem(GRANTED_KEY) ?? '{}'); }
    catch { return {}; }
  }
}