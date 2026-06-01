import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelService } from '../services/models/channel.service';

@Component({
  selector: 'app-my-channel-redirect',
  standalone: true,
  template: `<div class="loading-redirect">
                <span class="loader"></span>
            </div>`,
  styles: [`.loading-redirect { display:flex; align-items:center; justify-content:center; height:60vh; }`]
})
export class MyChannelRedirect implements OnInit {
  private readonly channelService = inject(ChannelService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    //obtiene el canal del usuario autenticado y redirige a la vista unificada
    this.channelService.getMe().subscribe({
      next:(channel) => this.router.navigate(['/channel', channel.channelId], { replaceUrl: true }),
      error: ()=> this.router.navigate(['/create-channel'], { replaceUrl: true }),
    });
  }
}