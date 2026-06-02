import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recover-password-dialog.html',
  styleUrl: './recover-password-dialog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RecoverPasswordDialog {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly dialogRef = inject(MatDialogRef<RecoverPasswordDialog>);

  loading = signal(false);
  error = signal('');
  success = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService
      .recoverPasswordSendOTP(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.success.set('Se envió un código de recuperación a tu correo.');

          setTimeout(() => {
            this.dialogRef.close();
            this.router.navigate(['/recover-password'], {
              queryParams: { email: this.form.getRawValue().email },
            });
          }, 1000);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'No se pudo enviar el código.');
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
