import { AbstractControl, ValidationErrors } from '@angular/forms';

const messages: Record<string, (params?: any) => string> = {
  required: () => 'Requerido',
  email: () => 'Email inválido',
  minlength: (p) => `Mínimo ${p.requiredLength} caracteres`,
  maxlength: (p) => `Máximo ${p.requiredLength} caracteres`,
  min: (p) => `Mínimo ${p.min}`,
  max: (p) => `Máximo ${p.max}`,
  pattern: () => 'Formato inválido',
  minAge: (p) => `Debes tener al menos ${p.required} años`,
};

export function getFieldError(control: AbstractControl | null): string {
  if (!control?.touched || !control?.invalid) return '';
  const firstError = Object.keys(control.errors ?? {})[0];
  return messages[firstError]?.(control.errors?.[firstError]) ?? 'Campo inválido';
}

export function minAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    const birth = new Date(control.value);
    const age = today.getFullYear() - birth.getFullYear();
    const hadBirthday =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    const realAge = hadBirthday ? age : age - 1;
    return realAge >= minAge ? null : { minAge: { required: minAge, actual: realAge } };
  };
}
