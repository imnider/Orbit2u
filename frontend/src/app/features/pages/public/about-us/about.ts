import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './about.html',
    styleUrl: './about.scss',
})
export class About {
    readonly team = [
        {
        name: 'Juliet Morales',
        initials: 'JM',
        roles: ['Frontend'],
        },
        {
        name: 'Neider Vélez',
        initials: 'NV',
        roles: ['Backend'],
        },
    ];

    readonly sharedRole = 'Base de datos';
}