import type { FormFieldConfig, ValidationError, WorkingDays } from '../types';

const OPTIONAL_FIELDS = ['profileImage', 'lastName'];

export const validateField = (
  field: FormFieldConfig,
  value: unknown
): string | null => {
  if (OPTIONAL_FIELDS.includes(field.name)) {
    return null;
  }

  if (!field.required) {
    return null;
  }

  if (value === undefined || value === null || value === '') {
    return `${field.label} is required`;
  }

  if (field.type === 'email' && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }

  if (field.type === 'password' && typeof value === 'string') {
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
  }

  if (field.type === 'tel' && typeof value === 'string') {
    const phoneRegex = /^[+]?[\d\s()-]{7,}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
  }

  return null;
};

export const validateWorkingDays = (workingDays: WorkingDays): string | null => {
  const filledDays = Object.keys(workingDays).filter((day) => {
    const entry = workingDays[day as keyof WorkingDays];
    return entry && entry.startHours && entry.endHours;
  });

  if (filledDays.length < 5) {
    return 'At least 5 working days must be filled';
  }

  for (const day of filledDays) {
    const entry = workingDays[day as keyof WorkingDays]!;
    if (entry.startHours >= entry.endHours) {
      return `${day}: Start time must be before end time`;
    }
  }

  return null;
};

export const validateForm = (
  fields: FormFieldConfig[],
  values: Record<string, unknown>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    const value = values[field.name];
    const error = validateField(field, value);
    if (error) {
      errors.push({ field: field.name, message: error });
    }
  }

  if ('workingDays' in values) {
    const wdError = validateWorkingDays(values.workingDays as WorkingDays);
    if (wdError) {
      errors.push({ field: 'workingDays', message: wdError });
    }
  }

  if ('address' in values) {
    const addr = values.address as { lng: number; lat: number } | undefined;
    if (!addr || (addr.lat === 0 && addr.lng === 0)) {
      errors.push({ field: 'address', message: 'Please select a location on the map' });
    }
  }

  return errors;
};
