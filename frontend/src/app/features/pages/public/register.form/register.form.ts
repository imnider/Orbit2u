import { Component, inject, signal, OnInit, computed } from '@angular/core';
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
import { getFieldError, minAgeValidator } from '../../../../shared/utils/form-error';

type PageState = 'validating' | 'form' | 'expired' | 'error';

@Component({
  selector: 'app-register-complete',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
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

  private _day = signal(1);
  private _month = signal(1);
  private _year = signal(new Date().getFullYear() - 18);

  readonly displayDay = computed(() => String(this._day()).padStart(2, '0'));
  readonly displayMonth = computed(() => String(this._month()).padStart(2, '0'));
  readonly displayYear = computed(() => String(this._year()));

  private token = '';

  form = this.fb.nonNullable.group({
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    displayName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    birthday: ['', [Validators.required, minAgeValidator(13)]],
    location: ['', [Validators.required]],
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
        error: (err) => this.error.set(err?.error?.message ?? 'Error al completar el registro'),
      });
  }

  getError(controlName: string): string {
    return getFieldError(this.form.get(controlName));
  }

  readonly calendarDate = computed(() => new Date(this._year(), this._month() - 1, this._day()));

  stepDate(unit: 'day' | 'month' | 'year', dir: 1 | -1): void {
    if (unit === 'day') {
      const max = new Date(this._year(), this._month(), 0).getDate();
      this._day.set(((this._day() - 1 + dir + max) % max) + 1);
    } else if (unit === 'month') {
      this._month.set(((this._month() - 1 + dir + 12) % 12) + 1);
      // corregir día si el mes nuevo tiene menos días
      const max = new Date(this._year(), this._month(), 0).getDate();
      if (this._day() > max) this._day.set(max);
    } else {
      this._year.set(this._year() + dir);
    }
    this.syncBirthday();
  }

  onCalendarPick(date: Date | null): void {
    if (!date) return;
    this._day.set(date.getDate());
    this._month.set(date.getMonth() + 1);
    this._year.set(date.getFullYear());
    this.syncBirthday();
  }

  private syncBirthday(): void {
    const iso = new Date(this._year(), this._month() - 1, this._day()).toISOString();
    this.form.controls.birthday.setValue(iso);
    this.form.controls.birthday.markAsTouched();
  }
}
