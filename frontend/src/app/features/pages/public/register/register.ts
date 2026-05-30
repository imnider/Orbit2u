import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { COUNTRIES } from '../../../../shared/constants/countries';

@Component({
  selector: 'app-register',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, RouterLink, MatDatepickerModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './register.html',
  styleUrl: '../login/login.scss'
})
export class Register implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  countries = COUNTRIES;
  loading = signal(false);
  error = signal('');
  isEmailVerified = signal(false);

  //formulario principal
  form = this.fb.nonNullable.group({
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    displayname: ['', [Validators.required]],
    birthday: ['', [Validators.required]],
    location: ['', [Validators.required]],
  });

  // mini-formulario para el paso de verificacion
  emailStepForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {}

  //enviar correo
  onVerifyEmail(): void {
    if (this.emailStepForm.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const email = this.emailStepForm.value.email!;

    this.authService.verifyEmail(email)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.isEmailVerified.set(true);
          this.form.patchValue({ email: email });
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Error al enviar verificación');
        }
      });
  }

  //registro
  onRegister(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    //capturar email
    this.authService.register(this.form.getRawValue() as any)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {this.router.navigate(['/dashboard']);},
        error: (err) => {this.error.set(err?.error?.message ?? 'Error en el registro');}
      });
  }

  getErrorMessage(controlName: string): string {
    const control = this.isEmailVerified() ? this.form.get(controlName) : this.emailStepForm.get(controlName);
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'Requerido';
      if (control.hasError('email')) return 'Email inválido';
      if (control.hasError('minlength')) return 'Muy corto';
    }
    return '';
  }
}