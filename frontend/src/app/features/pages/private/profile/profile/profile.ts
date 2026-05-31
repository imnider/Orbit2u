import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from '../../../../services/models/user.service';
import { CurrentUser } from '../../../../interfaces/public/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  user = signal<CurrentUser | null>(null);
  loadingUser = signal(true);

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.loadingUser.set(true);
    this.userService.getMe().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loadingUser.set(false);
      },
      error: () => this.loadingUser.set(false),
    });
  }
}