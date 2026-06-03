import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light' | 'midnight' | 'rosewave';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private readonly storageKey = 'orbit2u-theme';
  private currentTheme: Theme = 'dark';

  private _theme$ = new BehaviorSubject<Theme>('dark');
  readonly theme$ = this._theme$.asObservable();

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.applyTheme('dark');
      return;
    }
    const saved = localStorage.getItem(this.storageKey) as Theme | null;
    this.applyTheme(saved ?? 'dark');
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    this.applyTheme(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  private applyTheme(theme: Theme): void {
    const themes: Theme[] = ['dark', 'light', 'midnight', 'rosewave'];
    if (isPlatformBrowser(this.platformId)) {
      themes.forEach((t) => this.renderer.removeClass(document.body, `theme-${t}`));
      this.renderer.addClass(document.body, `theme-${theme}`);
    }
    this.currentTheme = theme;
    this._theme$.next(theme);
  }
}
