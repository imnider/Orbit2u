import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { getFieldError } from '../../../../shared/utils/form-error';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const parent = control.parent;
  if (!parent) return null;
  const password = parent.get('newPassword')?.value;
  return control.value === password ? null : { mismatch: true };
}

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recover-password.html',
  styleUrl: '../login/login.scss',
})
export class RecoverPassword implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal('');
  success = signal(false);
  showPassword = signal(false);
  showConfirm = signal(false);
  email = signal('');

  form = this.fb.nonNullable.group({
    otp: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    confirmPassword: ['', [Validators.required, passwordsMatch]],
  });

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) this.email.set(email);

    this.form.get('newPassword')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirm(): void {
    this.showConfirm.update((v) => !v);
  }

  getError(field: string): string {
    return getFieldError(this.form.get(field));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { otp, newPassword } = this.form.getRawValue();

    this.authService
      .recoverPassword(otp, { newPassword })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Código inválido o expirado.');
        },
      });
  }
}
