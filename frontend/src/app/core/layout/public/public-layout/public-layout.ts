import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../features/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout implements OnInit {
  private readonly authService = inject(AuthService);
 
  isAuthenticated = computed(() => this.authService.isAuthenticated());
 
  get displayName(): string {
    return this.authService.payload()?.UserId ?? 'Astronauta';
  }
 
  //sidebar state
  sidebarCollapsed = false;
  mobileMenuOpen   = false;
 
  //topbar state
  searchQuery   = '';
  searchFocused = false;
  isDarkTheme   = true;
  notifCount    = 3; // placeholder
  userMenuOpen  = false;
 
  ngOnInit(): void {
    // Restore sidebar preference from localStorage
    const saved = localStorage.getItem('orbit2u_sidebar_collapsed');
    if (saved !== null) {
      this.sidebarCollapsed = saved === 'true';
    }
  }
 
  // sidebar
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('orbit2u_sidebar_collapsed', String(this.sidebarCollapsed));
  }
 
  openMobileMenu(): void  { this.mobileMenuOpen = true; }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }
 
  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    // TODO: navigate to /search?q=...
    console.log('Searching for:', this.searchQuery);
  }
 
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.documentElement.setAttribute(
      'data-theme',
      this.isDarkTheme ? 'dark' : 'light'
    );
  }
 
  toggleUserMenu(): void { this.userMenuOpen = !this.userMenuOpen; }
  closeUserMenu(): void  { this.userMenuOpen = false; }
 
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen = false;
    }
  }
 
  logout(): void {
    this.userMenuOpen = false;
    this.authService.logout();
  }
  
}
