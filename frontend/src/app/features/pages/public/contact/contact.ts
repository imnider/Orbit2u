import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
    templateUrl: './contact.html',
    styleUrl: './contact.scss',
})
export class Contact {
    readonly email = 'orbitinfo@orbit2u.com';
    readonly phone = '3001 23456';

    emailCopied = signal(false);

    copyEmail(): void {
        navigator.clipboard.writeText(this.email).then(() => {
        this.emailCopied.set(true);
        setTimeout(() => this.emailCopied.set(false), 2000);
        });
    }
}