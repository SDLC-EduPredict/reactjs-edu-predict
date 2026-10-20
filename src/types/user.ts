export const USER_ROLES = ['STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const STAFF_ROLES: readonly UserRole[] = ['FACULTY', 'ADMIN', 'SUPER_ADMIN'];
export const ADMIN_ROLES: readonly UserRole[] = ['ADMIN', 'SUPER_ADMIN'];

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: UserRole;
  role_display: string;
  is_active: boolean;
  email_verified: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface AuthUser extends User {
  permissions: string[];
}
