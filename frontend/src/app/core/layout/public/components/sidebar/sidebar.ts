import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  readonly discoverItems: NavItem[] = [
    { label: 'Inicio',      icon: 'home',    route: '/home'        },
    { label: 'Explorar',    icon: 'explore', route: '/explore'     },
    { label: 'Comunidades', icon: 'public',  route: '/communities' },
    { label: 'Planes',      icon: 'card_membership', route: '/planes' },
  ];

  readonly libraryItems: NavItem[] = [
    { label: 'Playlists',      icon: 'queue_music', route: '/playlists'     },
    { label: 'Suscripciones',  icon: 'tune',        route: '/subscriptions' },
  ];

  readonly spaceItems: NavItem[] = [
    { label: 'Mi perfil',    icon: 'person',    route: '/profile'     },
    { label: 'Preferencias', icon: 'tune',      route: '/preferences' },
  ];

  readonly footerItems: NavItem[] = [
    { label: 'About us', icon: 'info',  route: '/about'   },
    { label: 'Contacto', icon: 'email', route: '/contact' },
  ];
}