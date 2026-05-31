import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrentUser } from '../../../../interfaces/public/user.interface';
import { UserService } from '../../../../services/models/user.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  providers: [DatePipe],
  imports: [],
  templateUrl: './profile-view.html',
  styleUrl: '../profile/profile.scss',
})
export class ProfileView implements OnInit {
  private readonly userService = inject(UserService);
  private readonly datePipe = inject(DatePipe);

  user = signal<CurrentUser | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el perfil');
        this.loading.set(false);
      },
    });
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  formatPrice(price: number): string {
    return price === 0 ? 'Gratis' : `$${price.toFixed(2)}/mes`;
  }

  getRoleLabel(roleName: string | undefined): string {
    if (!roleName) return '—';
    const map: Record<string, string> = {
      Usuario: 'Usuario',
      ContentCreator: 'Creador de contenido',
      Administrador: 'Administrador',
    };
    return map[roleName] ?? roleName;
  }
}