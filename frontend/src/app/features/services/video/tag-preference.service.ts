import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { TagDto } from '../../interfaces/public/tag.interface';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environment/environment';

//solo para no logueados se borra al cerrar el tab
const SESSION_TAGS_KEY = 'orbit2u_session_tags';
const SESSION_DIALOG_KEY = 'orbit2u_session_dialog_shown';

@Injectable({ providedIn: 'root' })
export class TagPreferencesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private _selectedTags = signal<TagDto[]>([]);

  readonly selectedTags = this._selectedTags.asReadonly();
  readonly selectedTagIds = computed(() => {
    const tags = this._selectedTags();
    return Array.isArray(tags) ? tags.map(t => t.tagId) : [];
  });
  readonly hasPreferences = computed(() => {
    const tags = this._selectedTags();
    return Array.isArray(tags) && tags.length > 0;
  });

  constructor() {
    effect(() => {
      const userId = this.authService.userId();
      if (userId) {
        //cargar desde API y limpiar sesión anónima
        this.loadFromApi().subscribe();
      } else {
        //cargar desde sessionStorage
        this._selectedTags.set(this.loadFromSession());
      }
    });
  }

  get dialogShown(): boolean {
    if (this.authService.userId()) return true; // logueados nunca ven el dialog
    return sessionStorage.getItem(SESSION_DIALOG_KEY) === 'true';
  }

  markDialogShown(): void {
    if (!this.authService.userId()) {
      sessionStorage.setItem(SESSION_DIALOG_KEY, 'true');
    }
  }

  isSelected(tagId: string): boolean {
    return this.selectedTagIds().includes(tagId);
  }

  toggle(tag: TagDto): Observable<void> {
    const userId = this.authService.userId();
    const exists = this.isSelected(tag.tagId);

    if (userId) {
      const req$ = exists
        ? this.http.delete<void>(`${environment.apiUrl}/UserPreferences/tags/${tag.tagId}`)
        : this.http.post<void>(`${environment.apiUrl}/UserPreferences/tags/${tag.tagId}`, {});

      return req$.pipe(
        tap(() => {
          const current = this._selectedTags();
          const safe    = Array.isArray(current) ? current : [];
          const updated = exists
            ? safe.filter(t => t.tagId !== tag.tagId)
            : [...safe, tag];
          this._selectedTags.set(updated);
        }),
        catchError(() => of(void 0))
      );
    } else {
      const current = this._selectedTags();
      const safe    = Array.isArray(current) ? current : [];
      const updated = exists
        ? safe.filter(t => t.tagId !== tag.tagId)
        : [...safe, tag];
      this._selectedTags.set(updated);
      this.saveToSession(updated);
      return of(void 0);
    }
  }

  setTags(tags: TagDto[]): void {
    const safe = Array.isArray(tags) ? tags : [];
    this._selectedTags.set(safe);
    if (!this.authService.userId()) {
      this.saveToSession(safe);
    }
  }

  clear(): void {
    this._selectedTags.set([]);
    sessionStorage.removeItem(SESSION_TAGS_KEY);
    sessionStorage.removeItem(SESSION_DIALOG_KEY);
  }

  private loadFromApi(): Observable<TagDto[]> {
    return this.http.get<any>(`${environment.apiUrl}/UserPreferences`).pipe(
      map(r => {
        if (Array.isArray(r))        return r as TagDto[];
        if (Array.isArray(r?.data))  return r.data as TagDto[];
        if (Array.isArray(r?.tags))  return r.tags as TagDto[];
        if (Array.isArray(r?.data?.tags)) return r.data.tags as TagDto[];
        return [] as TagDto[];
      }),
      tap(tags => this._selectedTags.set(tags)),
      catchError(() => {
        this._selectedTags.set([]);
        return of([]);
      })
    );
  }

  private loadFromSession(): TagDto[] {
    try {
      const raw = sessionStorage.getItem(SESSION_TAGS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }

  private saveToSession(tags: TagDto[]): void {
    sessionStorage.setItem(SESSION_TAGS_KEY, JSON.stringify(tags));
  }
}