import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type PurchaseDialogType = 'plan' | 'coins';

@Component({
    selector: 'app-purchase-dialog',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './purchase-dialog.html',
    styleUrl: './purchase-dialog.scss',
})
export class PurchaseDialog {
    readonly itemName= input.required<string>();
    readonly itemPrice = input.required<number>();
    readonly type= input<PurchaseDialogType>('plan');
    readonly closed = output<void>();

    close(): void {
        this.closed.emit();
    }
}