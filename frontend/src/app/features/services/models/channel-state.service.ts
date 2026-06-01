import { Injectable, inject, signal, computed } from '@angular/core';
import { ChannelService } from './channel.service';
import { ChannelDto } from '../../interfaces/private/channel.interface';

@Injectable({ providedIn: 'root' })
export class ChannelStateService {
  private readonly channelService = inject(ChannelService);

  private _channel  = signal<ChannelDto | null>(null);
  private _loaded   = signal(false);

  readonly channel    = computed(() => this._channel());
  readonly hasChannel = computed(() => this._loaded() && this._channel() !== null);

  //después del login
  loadMyChannel(): void {
    this.channelService.getMe().subscribe({
      next: (ch) => { this._channel.set(ch); this._loaded.set(true); },
      error: () => { this._channel.set(null); this._loaded.set(true); },
    });
  }

  clear(): void {
    this._channel.set(null);
    this._loaded.set(false);
  }
}