import { Component, EventEmitter, Input, OnInit, Output, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../../features/services/auth/auth.service';
import { CurrentUser } from '../../../../../features/interfaces/public/user.interface';
import { JwtPayload } from 'jwt-decode';
import { CLAIMS } from '../../../../../shared/constants/claims.constants';
import { ChannelStateService } from '../../../../../features/services/models/channel-state.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  ngOnInit() {}

  @Input() collapsed = false;
  @Output() collapseToggle = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly channelState = inject(ChannelStateService);

  readonly isLoggedIn = this.authService.isAuthenticated;
  readonly isUser = computed(() => (this.authService.payload() as any)?.[CLAIMS.ROLE] === 'User');
  readonly isCreator = computed(
    () => (this.authService.payload() as any)?.[CLAIMS.ROLE] === 'Creator',
  );
  readonly isAdmin = computed(() => (this.authService.payload() as any)?.[CLAIMS.ROLE] === 'Admin');

  //items visibles para todos
  readonly discoverItems: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/home' },
    { label: 'Comunidades', icon: 'public', route: '/communities' },
    { label: 'Planes', icon: 'card_membership', route: '/planes/membership' },
    { label: 'Paquetes', icon: 'paid', route: '/planes/coins'},
  ];

  //items solo para usuarios logueados
  readonly libraryItems: NavItem[] = [
    { label: 'Playlists', icon: 'queue_music', route: '/playlists' },
    { label: 'Suscripciones', icon: 'subscriptions', route: '/subscriptions' },
  ];

  //items del espacio personal
  readonly spaceItems: NavItem[] = [
    { label: 'Mi perfil', icon: 'person', route: '/profile' },
    { label: 'Preferencias', icon: 'tune', route: '/preferences' },
  ];

  //items solo para creadores
  readonly creatorItems: NavItem[] = [
    { label: 'Mi canal', icon: 'play_circle', route: '/my-channel' },
  ];

  //items solo para admin
  readonly adminItems: NavItem[] = [
    { label: 'Panel admin', icon: 'admin_panel_settings', route: '/admin' },
  ];

  readonly footerItems: NavItem[] = [
    { label: 'About us', icon: 'info', route: '/about' },
    { label: 'Contacto', icon: 'email', route: '/contact' },
  ];

  readonly hasChannel = computed(() => this.channelState.hasChannel());
  readonly myChannelId = computed(() => this.channelState.channel()?.channelId ?? null);

  onCollapseToggle(): void {
    this.collapseToggle.emit();
  }
}
