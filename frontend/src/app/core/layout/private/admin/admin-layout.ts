import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

type AdminTab = 'metrics' | 'users' | 'videos';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {}