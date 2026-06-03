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

  readonly maxYear = computed(() => new Date().getFullYear() - 13);

  private maxDayForCurrentMonth(): number {
    return new Date(this._year(), this._month(), 0).getDate();
  }

  private clampDay(day: number): number {
    return Math.max(1, Math.min(day, this.maxDayForCurrentMonth()));
  }

  onDayInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 2) {
      input.value = input.value.slice(0, 2);
    }
    const val = parseInt(input.value, 10);
    if (!isNaN(val)) this._day.set(val);
  }

  onDayBlur(): void {
    this._day.set(this.clampDay(this._day()));
    this.syncBirthday();
  }

  onMonthInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 2) {
      input.value = input.value.slice(0, 2);
    }
    const val = parseInt(input.value, 10);
    if (!isNaN(val)) this._month.set(Math.max(1, Math.min(val, 12)));
  }

  onMonthBlur(): void {
    const clamped = Math.max(1, Math.min(this._month(), 12));
    this._month.set(clamped);
    this._day.set(this.clampDay(this._day()));
    this.syncBirthday();
  }

  onYearInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) this._year.set(val);
  }

  onYearBlur(): void {
    const min = 1900;
    const max = this.maxYear();
    this._year.set(Math.max(min, Math.min(this._year(), max)));
    this._day.set(this.clampDay(this._day()));
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
