import type { UserRole } from '@/types';

export const PATHS = {
  home: '/',
  about: '/about',
  courses: '/courses',
  course: (slug: string | number) => `/courses/${slug}`,
  categories: '/categories',
  faculty: '/faculty',
  facultyMember: (id: string) => `/faculty/${id}`,
  contact: '/contact',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  student: {
    root: '/student',
    dashboard: '/student/dashboard',
    profile: '/student/profile',
    courses: '/student/courses',
    attendance: '/student/attendance',
    assignments: '/student/assignments',
    results: '/student/results',
    performance: '/student/performance',
    prediction: '/student/prediction',
    notifications: '/student/notifications',
  },
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    students: '/admin/students',
    faculty: '/admin/faculty',
    courses: '/admin/courses',
    categories: '/admin/categories',
    enrolments: '/admin/enrolments',
    attendance: '/admin/attendance',
    assignments: '/admin/assignments',
    assessments: '/admin/assessments',
    performance: '/admin/performance',
    predictions: '/admin/predictions',
    reports: '/admin/reports',
    notifications: '/admin/notifications',
    settings: '/admin/settings',
  },
} as const;

export const homePathForRole = (role: UserRole | null | undefined): string =>
  role === 'STUDENT' ? PATHS.student.dashboard : role ? PATHS.admin.dashboard : PATHS.login;
