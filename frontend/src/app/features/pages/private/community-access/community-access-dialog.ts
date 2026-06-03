import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommunityAccessCodeService } from '../../../services/priv-community/community-access.service';

export interface AccessDialogData {
  communityId: string;
  communityName: string;
}

@Component({
  selector: 'app-community-access-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div class="access-dialog">
      <div class="access-dialog__header">
        <mat-icon class="access-dialog__lock-icon">lock</mat-icon>
        <h2 class="access-dialog__title">Comunidad privada</h2>
        <p class="access-dialog__sub">
          <strong>{{ data.communityName }}</strong> requiere un código de acceso
        </p>
      </div>

      <div class="access-dialog__body">
        <input
          class="access-dialog__input"
          [class.access-dialog__input--error]="showError()"
          type="text"
          maxlength="8"
          placeholder="XXXXXXXX"
          [(ngModel)]="codeInput"
          (ngModelChange)="showError.set(false)"
          (keyup.enter)="submit()"
          autofocus
        />
        @if (showError()) {
          <p class="access-dialog__error">
            <mat-icon>error_outline</mat-icon>
            Código incorrecto, inténtalo de nuevo
          </p>
        }
      </div>

      <div class="access-dialog__actions">
        <button class="access-dialog__btn access-dialog__btn--cancel" (click)="cancel()">
          Cancelar
        </button>
        <button
          class="access-dialog__btn access-dialog__btn--confirm"
          [disabled]="!codeInput.trim()"
          (click)="submit()"
        >
          Ingresar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .access-dialog {
      padding: 28px 24px 20px;
      width: 340px;
      background: var(--color-surface);
      border-radius: var(--radius-lg, 12px);
    }
    .access-dialog__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      text-align: center;
    }
    .access-dialog__lock-icon {
      font-size: 40px; width: 40px; height: 40px;
      color: var(--color-primary);
      opacity: 0.8;
    }
    .access-dialog__title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text);
    }
    .access-dialog__sub {
      margin: 0;
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }
    .access-dialog__body { margin-bottom: 20px; }
    .access-dialog__input {
      width: 100%;
      padding: 12px 16px;
      background: var(--color-surface-alt, #f5f5f5);
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-base, 8px);
      color: var(--color-text);
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-align: center;
      text-transform: uppercase;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
      &:focus { border-color: var(--color-primary); }
      &--error { border-color: #e53935; }
    }
    .access-dialog__error {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #e53935;
      font-size: 0.78rem;
      margin: 8px 0 0;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }
    .access-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .access-dialog__btn {
      padding: 9px 20px;
      border-radius: var(--radius-base, 8px);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s, background 0.2s;
      &--cancel {
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);
        &:hover { background: var(--color-surface-alt); }
      }
      &--confirm {
        background: var(--color-primary);
        color: #fff;
        &:hover { opacity: 0.88; }
        &:disabled { opacity: 0.4; cursor: not-allowed; }
      }
    }
  `]
})
export class CommunityAccessDialog {
  codeInput = '';
  showError = signal(false);

  constructor(
    public dialogRef: MatDialogRef<CommunityAccessDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AccessDialogData,
    private accessCodeService: CommunityAccessCodeService,
  ) {}

  submit(): void {
    if (!this.codeInput.trim()) return;
    const valid = this.accessCodeService.validateCode(this.data.communityId, this.codeInput);
    if (valid) {
      this.dialogRef.close({ granted: true });
    } else {
      this.showError.set(true);
    }
  }

  cancel(): void {
    this.dialogRef.close({ granted: false });
  }
}