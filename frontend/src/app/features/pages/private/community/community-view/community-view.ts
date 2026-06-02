import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin, finalize } from 'rxjs';

import { CommunityService } from '../../../../services/models/community.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommunityDto } from '../../../../interfaces/private/community.interface';
import { VideoDto } from '../../../../interfaces/private/video.interface';
import { VideoCard } from '../../../../../shared/components/video-card/video-card';
import { CommunityForm } from '../community-form/community-form';

@Component({
    selector: 'app-community-view',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule, VideoCard, CommunityForm],
    templateUrl: './community-view.html',
    styleUrl: './community-view.scss',
})
export class CommunityView implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly communityService = inject(CommunityService);
    private readonly authService = inject(AuthService);

    loading = signal(true);
    error = signal('');
    joining = signal(false);
    showEditForm = signal(false);
    showConfirmDelete = signal(false);
    deletingComm = signal(false);

    community = signal<CommunityDto | null>(null);
    videos = signal<VideoDto[]>([]);

    isMember = signal(false);

    readonly isOwner = computed(() => {
        const userId = this.authService.userId();
        return !!userId && this.community()?.userId === userId;
    });

    readonly memberCount = computed(() => this.community()?.memberCount ?? 0);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) { this.error.set('Comunidad no encontrada'); this.loading.set(false); return; }
        this.loadCommunity(id);
    }

    private loadCommunity(id: string): void {
        forkJoin({
        community: this.communityService.getById(id),
        videos: this.communityService.getVideos(id),
        })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
        next: ({ community, videos }) => {
            this.community.set(community);
            this.videos.set(videos);
            if (this.isOwner()) this.isMember.set(true);
            else this.checkMembership();
        },
        error: () => this.error.set('No se pudo cargar la comunidad'),
        });
    }

    private checkMembership(): void {
        this.communityService.getMemberships().subscribe({
        next: (memberships) => {
            const id = this.community()?.communityId;
            this.isMember.set(memberships.some(m => m.communityId === id));
        },
        error: () => this.isMember.set(false),
        });
    }

    toggleMembership(): void {
        const id = this.community()?.communityId;
        if (!id) return;
        this.joining.set(true);

        const action$ = this.isMember()
        ? this.communityService.leave(id)
        : this.communityService.join(id);

        action$.pipe(finalize(() => this.joining.set(false))).subscribe({
        next: () => {
            const joining = !this.isMember();
            this.isMember.set(joining);
            this.community.update(c => c ? ({ ...c, memberCount: c.memberCount + (joining ? 1 : -1),}) : c);
        },
        error: () => {},
        });
    }

    copyShareUrl(): void {
        navigator.clipboard.writeText(window.location.href);
    }

    openEdit(): void {
        this.showEditForm.set(true);
    }

    onEditSaved(updated: CommunityDto): void {
        this.community.set(updated);
        this.showEditForm.set(false);
    }

    onEditClosed(): void {
        this.showEditForm.set(false);
    }

    confirmDelete(): void {
        this.showConfirmDelete.set(true);
    }

    cancelDelete(): void {
        this.showConfirmDelete.set(false);
    }

    deleteCommunity(): void {
        const id = this.community()?.communityId;
        if (!id) return;
        this.deletingComm.set(true);
        this.communityService.delete(id)
        .pipe(finalize(() => this.deletingComm.set(false)))
        .subscribe({
            next: () => this.router.navigate(['/communities']),
            error: () => {},
        });
    }

    goToVideo(videoId: string): void {
        this.router.navigate(['/video', videoId]);
    }

    formatDuration(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    getInitial(name: string): string {
        return name.charAt(0).toUpperCase();
    }
}