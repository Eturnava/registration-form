import type { DayOfWeek } from '../types';

export const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
export const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, '0');
    slots.push(`${hh}:00`);
    slots.push(`${hh}:30`);
  }
  return slots;
})();

export const VEHICLE_OPTIONS = [
  { label: 'Car', value: 'car' },
  { label: 'Motorcycle', value: 'motorcycle' },
  { label: 'Bicycle', value: 'bicycle' },
  { label: 'Van', value: 'van' },
  { label: 'Truck', value: 'truck' },
];
