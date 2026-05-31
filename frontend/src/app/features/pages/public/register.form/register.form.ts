import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../services/auth/auth.service';
import { COUNTRIES } from '../../../../shared/constants/countries';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

type PageState = 'validating' | 'form' | 'expired' | 'error';

@Component({
  selector: 'app-register-complete',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, RouterLink,  MatDatepickerModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './register.form.html',
  styleUrl: '../login/login.scss',
})
export class RegisterForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  countries = COUNTRIES;
  state = signal<PageState>('validating');
  loading = signal(false);
  error = signal('');

  private token = '';

  form = this.fb.nonNullable.group({
    email:       [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    username:    ['', [Validators.required, Validators.minLength(3)]],
    displayName: ['', [Validators.required]],
    birthday:    ['', [Validators.required]],
    location:    ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';

    if (!this.token) {
      this.state.set('expired');
      return;
    }

    this.authService.validateRegisterToken(this.token).subscribe({
      next: (res) => {
        this.form.patchValue({ email: res.data.email });
        this.state.set('form');
      },
      error: () => this.state.set('expired'),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const data = this.form.getRawValue();

    this.authService
      .completeRegister(this.token, data)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) =>
          this.error.set(err?.error?.message ?? 'Error al completar el registro'),
      });
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.touched && control?.invalid) {
      if (control.hasError('required')) return 'Requerido';
      if (control.hasError('minlength')) return 'Muy corto';
    }
    return '';
  }
}