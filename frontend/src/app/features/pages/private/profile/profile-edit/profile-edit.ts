import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DatePipe } from '@angular/common';

import { COUNTRIES } from '../../../../../shared/constants/countries';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { UserService } from '../../../../services/models/user.service';
import { CurrentUser } from '../../../../interfaces/public/user.interface';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [ReactiveFormsModule, RouterLink, MatDatepickerModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile-edit.html',
  styleUrl: '../profile/profile.scss',
})
export class ProfileEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly datePipe = inject(DatePipe);

  countries = COUNTRIES;
  user = signal<CurrentUser | null>(null);
  loading = signal(false);
  loadingUser = signal(true);
  successMessage = signal('');
  error = signal('');

  //solo los campos editables (email y username no)
  form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    birthday:    ['', [Validators.required]],
    location:    ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
  });

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (res) => {
        this.user.set(res);
        this.form.patchValue({
          displayName: res.displayName,
          birthday:    res.birthday,
          location:    res.location,
        });
        this.loadingUser.set(false);
      },
      error: () => this.loadingUser.set(false),
    });
  }

  onSave(): void {
    if (this.form.invalid || !this.user()) return;
    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const { birthday, ...rest } = this.form.getRawValue();
    const payload = {
      ...rest,
      birthday: birthday ? new Date(birthday).toISOString() : null,
    };

    this.userService.updateUser(this.user()!.userId, payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.user.set(res.data);
          this.successMessage.set('Perfil actualizado correctamente');
        },
        error: (err) =>
          this.error.set(err?.error?.message ?? 'Error al actualizar el perfil'),
      });
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.touched || !c?.invalid) return '';
    if (c.hasError('required'))  return 'Este campo es requerido';
    if (c.hasError('minlength')) return `Mínimo ${c.errors?.['minlength'].requiredLength} caracteres`;
    if (c.hasError('maxlength')) return `Máximo ${c.errors?.['maxlength'].requiredLength} caracteres`;
    return '';
  }

  get canSave(): boolean {
    return this.form.valid && !this.loading();
  }
}