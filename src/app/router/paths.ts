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
  verifyAccount: '/verify-account',
  student: {
    root: '/student',
    dashboard: '/student/dashboard',
    courses: '/student/courses',
    attendance: '/student/attendance',
    assignments: '/student/assignments',
    results: '/student/results',
    performance: '/student/performance',
    prediction: '/student/prediction',
    notifications: '/student/notifications',
    profile: '/student/profile',
  },
  faculty_portal: {
    root: '/faculty-portal',
    dashboard: '/faculty-portal/dashboard',
    batches: '/faculty-portal/batches',
    attendance: '/faculty-portal/attendance',
    assignments: '/faculty-portal/assignments',
    assessments: '/faculty-portal/assessments',
    students: '/faculty-portal/students',
    performance: '/faculty-portal/performance',
    predictions: '/faculty-portal/predictions',
    notifications: '/faculty-portal/notifications',
    profile: '/faculty-portal/profile',
  },
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    students: '/admin/students',
    faculty: '/admin/faculty',
    categories: '/admin/categories',
    courses: '/admin/courses',
    enrolments: '/admin/enrolments',
    attendance: '/admin/attendance',
    assignments: '/admin/assignments',
    assessments: '/admin/assessments',
    performance: '/admin/performance',
    predictions: '/admin/predictions',
    models: '/admin/ml-models',
    reports: '/admin/reports',
    notifications: '/admin/notifications',
    inbox: '/admin/inbox',
    settings: '/admin/settings',
  },
} as const;

export const homePathForRole = (role: UserRole | null | undefined): string => {
  if (role === 'STUDENT') return PATHS.student.dashboard;
  if (role === 'FACULTY') return PATHS.faculty_portal.dashboard;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return PATHS.admin.dashboard;
  return PATHS.login;
};

export const profilePathForRole = (role: UserRole | null | undefined): string => {
  if (role === 'STUDENT') return PATHS.student.profile;
  if (role === 'FACULTY') return PATHS.faculty_portal.profile;
  return PATHS.admin.settings;
};

export type PortalKind = 'student' | 'faculty' | 'admin';

export const portalLinks = (portal: PortalKind) => {
  if (portal === 'student') {
    return { dashboard: PATHS.student.dashboard, profile: PATHS.student.profile, notifications: PATHS.student.notifications };
  }
  if (portal === 'faculty') {
    return {
      dashboard: PATHS.faculty_portal.dashboard,
      profile: PATHS.faculty_portal.profile,
      notifications: PATHS.faculty_portal.notifications,
    };
  }
  return { dashboard: PATHS.admin.dashboard, profile: PATHS.admin.settings, notifications: PATHS.admin.inbox };
};

export const portalForRole = (role: UserRole | null | undefined): PortalKind =>
  role === 'STUDENT' ? 'student' : role === 'FACULTY' ? 'faculty' : 'admin';
