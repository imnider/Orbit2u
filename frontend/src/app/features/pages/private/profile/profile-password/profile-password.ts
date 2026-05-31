import { Component, inject, signal } from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { finalize } from 'rxjs';
import { UserService } from '../../../../services/models/user.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPass = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return newPass && confirm && newPass !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-profile-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-password.html',
  styleUrl: '../profile/profile.scss',
})
export class ProfilePassword {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  loading = signal(false);
  successMessage = signal('');
  error = signal('');

  form = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      newPassword:     ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const { currentPassword, newPassword } = this.form.getRawValue();

    this.userService.changePassword({ currentPassword, newPassword })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Contraseña actualizada correctamente');
          this.form.reset();
        },
        error: (err) =>
          this.error.set(err?.error?.message ?? 'Error al cambiar la contraseña'),
      });
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.touched || !c?.invalid) return '';
    if (c.hasError('required'))  return 'Este campo es requerido';
    if (c.hasError('minlength')) return 'Mínimo 10 caracteres';
    if (c.hasError('maxlength')) return 'Máximo 255 caracteres';
    return '';
  }

  get passwordMismatch(): boolean {
    const confirm = this.form.get('confirmPassword');
    return !!(confirm?.touched && this.form.hasError('passwordMismatch'));
  }

  get canSubmit(): boolean {
    return this.form.valid && !this.loading();
  }
}