import type { FormFieldConfig } from '../types';
import { VEHICLE_OPTIONS } from './constants';

const commonFields: FormFieldConfig[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: false },
  { name: 'pid', label: 'Personal ID', type: 'text', required: true },
  { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  { name: 'profileImage', label: 'Profile Image', type: 'image', required: false },
];

export const adminFields: FormFieldConfig[] = [
  ...commonFields,
  { name: 'role', label: 'Role', type: 'hidden', required: true },
];

export const userFields: FormFieldConfig[] = [
  ...commonFields,
  { name: 'role', label: 'Role', type: 'hidden', required: true },
  { name: 'address', label: 'Address (Select on Map)', type: 'map', required: true },
];

export const courierFields: FormFieldConfig[] = [
  { name: 'role', label: 'Role', type: 'hidden', required: true },
  ...commonFields,
  {
    name: 'vehicle',
    label: 'Vehicle',
    type: 'select',
    required: true,
    options: VEHICLE_OPTIONS,
  },
  { name: 'workingDays', label: 'Working Days', type: 'workingDays', required: true },
];

export const getFieldsByRole = (role: string): FormFieldConfig[] => {
  switch (role) {
    case 'admin':
      return adminFields;
    case 'user':
      return userFields;
    case 'courier':
      return courierFields;
    default:
      return [];
  }
};
