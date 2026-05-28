import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./features/pages/public/login/login";
import { PublicLayout } from "./core/layout/public/public-layout/public-layout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, PublicLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
