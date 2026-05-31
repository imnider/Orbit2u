import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { finalize } from 'rxjs';

import { COUNTRIES } from '../../../../shared/constants/countries';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../services/models/user.service';
import { CurrentUser } from '../../../interfaces/public/user.interface';

type ActiveSection = 'profile' | 'plan' | 'edit' | 'password';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [ReactiveFormsModule, MatDatepickerModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTooltipModule, ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly datePipe = inject(DatePipe);

  countries = COUNTRIES;
  activeSection = signal<ActiveSection>('profile');
  user = signal<CurrentUser | null>(null);
  loading = signal(false);
  loadingUser = signal(true);
  successMessage = signal('');
  error = signal('');

  //editar
  editForm = this.fb.nonNullable.group({
    userName:    ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    displayName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    email:       ['', [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(60)]],
    birthday:    ['', [Validators.required]],
    location:    ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
  });

  //cambiar contraseña
  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      newPassword:     ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    this.loadUser();
  }

  setSection(section: ActiveSection): void {
    this.successMessage.set('');
    this.error.set('');
    this.activeSection.set(section);

    if (section === 'edit' && this.user()) {
      this.patchEditForm(this.user()!);
    }
  }

  //cargar al usuario
  private loadUser(): void {
    this.loadingUser.set(true);
    this.userService.getMe()
      .pipe(finalize(() => this.loadingUser.set(false)))
      .subscribe({
        next: (user) => this.user.set(user),
        error: () => this.error.set('No se pudo cargar el perfil'),
      });
  }

  private patchEditForm(user: CurrentUser): void {
    this.editForm.patchValue({
      userName:    user.userName,
      displayName: user.displayName,
      email:       user.email,
      birthday:    user.birthday,
      location:    user.location,
    });
  }

  //subir la info editada al perfil
  onSaveProfile(): void {
    if (this.editForm.invalid || !this.user()) return;
    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const { birthday, ...rest } = this.editForm.getRawValue();
    const payload = {...rest, birthday: birthday ? new Date(birthday).toISOString() : null,
    };

    this.userService.updateUser(this.user()!.userId, payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.user.set(res.data);
          this.successMessage.set('Perfil actualizado correctamente');
          this.activeSection.set('profile');
        },
        error: (err) => this.error.set(err?.error?.message ?? 'Error al actualizar el perfil'),
      });
  }

  //contraseña actualizada
  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    this.userService.changePassword({ currentPassword, newPassword })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Contraseña actualizada correctamente');
          this.passwordForm.reset();
        },
        error: (err) => this.error.set(err?.error?.message ?? 'Error al cambiar la contraseña'),
      });
  }

  //helpers de los errores
  getEditError(field: string): string {
    const c = this.editForm.get(field);
    if (!c?.touched || !c?.invalid) return '';
    if (c.hasError('required'))   return 'Requerido';
    if (c.hasError('email'))      return 'Email inválido';
    if (c.hasError('minlength'))  return `Mínimo ${c.errors?.['minlength'].requiredLength} caracteres`;
    if (c.hasError('maxlength'))  return `Máximo ${c.errors?.['maxlength'].requiredLength} caracteres`;
    return '';
  }

  getPasswordError(field: string): string {
    const c = this.passwordForm.get(field);
    if (!c?.touched || !c?.invalid) return '';
    if (c.hasError('required'))  return 'Requerido';
    if (c.hasError('minlength')) return 'Mínimo 10 caracteres';
    if (c.hasError('maxlength')) return 'Máximo 255 caracteres';
    return '';
  }

  get passwordMismatch(): boolean {
    return this.passwordForm.touched && !!this.passwordForm.hasError('passwordMismatch');
  }

  //display helpers
  formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  formatPrice(price: number): string {
    return price === 0 ? 'Gratis' : `$${price.toFixed(2)}/mes`;
  }
}
