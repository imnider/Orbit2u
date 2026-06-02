import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { CommunityService } from '../../../../services/models/community.service';
import { CommunityDto } from '../../../../interfaces/private/community.interface';

@Component({
    selector: 'app-community-form',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './community-form.html',
    styleUrl: './community-form.scss',
})
export class CommunityForm implements OnInit {
    private readonly communityService = inject(CommunityService);

    readonly community = input<CommunityDto | null>(null);

    readonly saved  = output<CommunityDto>();
    readonly closed = output<void>();

    saving = signal(false);
    error  = signal('');

    name = '';
    description = '';
    avatarUrl = '';
    bannerUrl = '';
    isPrivate = false;

    readonly isEdit = () => !!this.community();

    ngOnInit(): void {
        const c = this.community();
        if (c) {
        this.name = c.name;
        this.description = c.description ?? '';
        this.avatarUrl = c.avatarUrl ?? '';
        this.bannerUrl = c.bannerUrl ?? '';
        this.isPrivate = c.isPrivate;
        }
    }

    submit(): void {
        if (!this.name.trim()) {
        this.error.set('El nombre es obligatorio');
        return;
        }
        this.error.set('');
        this.saving.set(true);

        const payload = {
        name: this.name.trim(),
        description: this.description.trim() || null,
        avatarUrl: this.avatarUrl.trim() || null,
        bannerUrl: this.bannerUrl.trim() || null,
        isPrivate: this.isPrivate,
        };

        const c = this.community();
        const req$ = c
        ? this.communityService.update(c.communityId, payload)
        : this.communityService.create(payload);

        req$.pipe(finalize(() => this.saving.set(false))).subscribe({
        next: (result) => this.saved.emit(result),
        error: () => this.error.set('Ocurrió un error. Inténtalo de nuevo.'),
        });
    }

    close(): void {
        this.closed.emit();
    }
}