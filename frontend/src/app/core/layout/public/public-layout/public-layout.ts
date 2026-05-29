import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme/theme.service';
import { Topbar } from "../components/topbar/topbar";
import { Sidebar } from "../components/sidebar/sidebar";
import { RouterOutlet } from '@angular/router';

interface StarStyle {
  top: string;
  left: string;
  '--twinkle-dur': string;
  '--twinkle-delay': string;
  opacity: string;
}

@Component({
  selector: 'app-public-layout',
  imports: [Topbar, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.scss']
})
export class PublicLayout implements OnInit {
  stars: StarStyle[] = [];
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.init();
    this.generateStars(120);
  }

  //funcion para que se generen estrellas
  private generateStars(count: number): void {
    this.stars = Array.from({ length: count }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      '--twinkle-dur': `${2 + Math.random() * 4}s`,
      '--twinkle-delay': `${Math.random() * 5}s`,
      opacity: `${0.2 + Math.random() * 0.6}`,
    }));
  }
}