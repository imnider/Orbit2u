import { Component } from '@angular/core';
import { Theme, ThemeService } from '../../../../services/theme/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ThemeOption {
  value: Theme;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class Topbar {
  showThemeMenu = false;

  readonly themes: ThemeOption[] = [
    { value: 'dark',      icon: 'dark_mode',       label: 'Dark'      },
    { value: 'midnight',  icon: 'nights_stay',     label: 'Midnight'  },
    { value: 'rosewave',  icon: 'local_florist',   label: 'Rosewave'  },
    { value: 'light',     icon: 'light_mode',      label: 'Light'     },
  ];

  constructor(private themeService: ThemeService) {}

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
}