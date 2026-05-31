import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loading = signal(false);
  error = signal('');
  emailSent = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.authService
      .registerInit(this.form.getRawValue().email)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.emailSent.set(true),
        error: (err) =>
          this.error.set(err?.error?.message ?? 'Error al enviar verificación'),
      });
  }

  getEmailError(): string {
    const control = this.form.get('email');
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'El correo es requerido';
      if (control.hasError('email')) return 'Email inválido';
    }
    return '';
  }
}