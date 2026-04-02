export type Role = 'admin' | 'user' | 'courier';

export interface WorkingHours {
  startHours: string;
  endHours: string;
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type WorkingDays = Partial<Record<DayOfWeek, WorkingHours>>;

export interface Address {
  lng: number;
  lat: number;
}

export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  pid: string;
  phoneNumber: string;
  email: string;
  password: string;
  profileImage: string;
  role: Role;
}

export interface AdminUser extends BaseUser {
  role: 'admin';
}

export interface RegularUser extends BaseUser {
  role: 'user';
  address: Address;
}

export interface CourierUser extends BaseUser {
  role: 'courier';
  vehicle: string;
  workingDays: WorkingDays;
}

export type AppUser = AdminUser | RegularUser | CourierUser;

export interface CourierRequest {
  id: string;
  userId: string;
  courierId: string;
  day: DayOfWeek;
  startHours: string;
  endHours: string;
  createdAt: string;
}

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'select'
  | 'image'
  | 'map'
  | 'workingDays'
  | 'hidden';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: { label: string; value: string }[];
  nested?: boolean;
  parentField?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
