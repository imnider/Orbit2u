import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, finalize } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import {Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
import { AdminUserService } from '../../../services/admin/admin-user.service';
import { AdminVideoService } from '../../../services/admin/admin-video.service';
import { ChannelService } from '../../../services/models/channel.service';
import { MatIconModule } from '@angular/material/icon';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface MetricCard {
  label: string;
  value: number;
  icon:  string;
  color: string;
}

@Component({
  selector: 'app-admin-metrics',
  standalone: true,
  imports: [MatIconModule, CommonModule, BaseChartDirective],
  templateUrl: './admin-metrics.html',
  styleUrl: './admin-metrics.scss'
})
export class AdminMetrics implements OnInit {
  private readonly userService    = inject(AdminUserService);
  private readonly videoService   = inject(AdminVideoService);
  private readonly channelService = inject(ChannelService);

  loading = signal(true);

  cards = signal<MetricCard[]>([]);

  //datos del grafico
  barChartData = signal<ChartData<'bar'>>({
    labels: ['Usuarios', 'Canales', 'Videos', 'Creadores'],
    datasets: [{
      label: 'Total en el sistema',
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(139, 92, 246, 0.7)',
        'rgba(167, 139, 250, 0.7)',
        'rgba(196, 181, 253, 0.7)',
        'rgba(109, 40, 217, 0.7)',
      ],
      borderColor: [
        'rgb(139, 92, 246)',
        'rgb(167, 139, 250)',
        'rgb(196, 181, 253)',
        'rgb(109, 40, 217)',
      ],
      borderWidth: 2,
      borderRadius: 8,
    }]
  });

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} registros`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { color: 'rgba(156,163,175,0.1)' },
        ticks: { color: '#9ca3af', precision: 0 }
      }
    }
  };

  ngOnInit(): void {
    forkJoin({
      users: this.userService.getAll(undefined, 1000, 0),
      videos: this.videoService.getAll(undefined, 1000, 0),
      channels: this.channelService.getAll(undefined, 1000, 0),
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: ({ users, videos, channels }) => {
        const creators = users.filter(u =>
          u.membershipPlan?.membershipPlanId && u.membershipPlan.membershipPlanId > 1
        ).length;

        this.cards.set([
          { label: 'Usuarios totales', value: users.length, icon: 'group', color: 'purple' },
          { label: 'Canales creados', value: channels.length, icon: 'play_circle', color: 'violet' },
          { label: 'Videos subidos', value: videos.length, icon: 'video_library', color: 'indigo' },
          { label: 'Usuarios premium', value: creators, icon: 'workspace_premium', color: 'fuchsia' },
        ]);

        this.barChartData.update(d => ({
          ...d,
          datasets: [{
            ...d.datasets[0],
            data: [users.length, channels.length, videos.length, creators]
          }]
        }));
      }
    });
  }
}