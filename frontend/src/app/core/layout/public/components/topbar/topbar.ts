import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Theme, ThemeService } from '../../../../services/theme/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../features/services/auth/auth.service';

interface ThemeOption {
  value: Theme;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatTooltipModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class Topbar {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  private readonly themeService = inject(ThemeService);
  private readonly authService  = inject(AuthService);
  
  showThemeMenu = false;

  //para actualizar al login/logout automaticamente
  readonly isLoggedIn = this.authService.isAuthenticated;

  readonly themes: ThemeOption[] = [
    { value: 'dark',      icon: 'dark_mode',       label: 'Dark'      },
    { value: 'light',     icon: 'light_mode',      label: 'Light'     },
    { value: 'midnight',  icon: 'nights_stay',     label: 'Midnight'  },
    { value: 'rosewave',  icon: 'local_florist',   label: 'Rosewave'  },
  ];

  get activeTheme(): Theme {
    return this.themeService.getTheme();
  }

  get activeThemeOption(): ThemeOption {
    return this.themes.find(t => t.value === this.activeTheme) ?? this.themes[0];
  }

  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.showThemeMenu = false;
  }

  toggleThemeMenu(): void {
    this.showThemeMenu = !this.showThemeMenu;
  }

  closeThemeMenu(): void {
    this.showThemeMenu = false;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}