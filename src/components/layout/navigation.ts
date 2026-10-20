import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  CalendarCheck2,
  ClipboardList,
  FileText,
  FolderTree,
  GraduationCap,
  LayoutDashboard,
  Settings,
  TrendingUp,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react';
import { PATHS } from '@/app/router/paths';
import type { UserRole } from '@/types';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles?: readonly UserRole[];
  permission?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const ADMINS: readonly UserRole[] = ['ADMIN', 'SUPER_ADMIN'];

export const STUDENT_NAV: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { to: PATHS.student.dashboard, label: 'Dashboard', icon: LayoutDashboard },
      { to: PATHS.student.profile, label: 'My Profile', icon: UserRound },
      { to: PATHS.student.courses, label: 'My Courses', icon: BookOpen },
    ],
  },
  {
    title: 'Academics',
    items: [
      { to: PATHS.student.attendance, label: 'Attendance', icon: CalendarCheck2 },
      { to: PATHS.student.assignments, label: 'Assignments', icon: FileText },
      { to: PATHS.student.results, label: 'Tests & Results', icon: Award },
    ],
  },
  {
    title: 'Insights',
    items: [
      { to: PATHS.student.performance, label: 'Performance', icon: TrendingUp },
      { to: PATHS.student.prediction, label: 'Predicted Score', icon: BrainCircuit },
      { to: PATHS.student.notifications, label: 'Notifications', icon: Bell },
    ],
  },
];

export const STAFF_NAV: NavSection[] = [
  {
    title: 'Overview',
    items: [{ to: PATHS.admin.dashboard, label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Management',
    items: [
      { to: PATHS.admin.students, label: 'Students', icon: Users, roles: ADMINS },
      { to: PATHS.admin.faculty, label: 'Faculty', icon: UsersRound, roles: ADMINS },
      { to: PATHS.admin.courses, label: 'Courses', icon: GraduationCap, roles: ADMINS },
      { to: PATHS.admin.categories, label: 'Categories', icon: FolderTree, roles: ADMINS },
      { to: PATHS.admin.enrolments, label: 'Enrolments', icon: ClipboardList, roles: ADMINS },
    ],
  },
  {
    title: 'Academics',
    items: [
      { to: PATHS.admin.attendance, label: 'Attendance', icon: CalendarCheck2 },
      { to: PATHS.admin.assignments, label: 'Assignments', icon: FileText },
      { to: PATHS.admin.assessments, label: 'Assessments & Marks', icon: Award },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { to: PATHS.admin.performance, label: 'Performance Monitoring', icon: TrendingUp },
      { to: PATHS.admin.predictions, label: 'ML Predictions', icon: BrainCircuit },
      { to: PATHS.admin.reports, label: 'Reports & Analytics', icon: BarChart3, permission: 'VIEW_REPORTS' },
    ],
  },
  {
    title: 'System',
    items: [
      { to: PATHS.admin.notifications, label: 'Notifications', icon: Bell },
      { to: PATHS.admin.settings, label: 'Settings', icon: Settings },
    ],
  },
];

export const filterNav = (
  sections: NavSection[],
  role: UserRole | null,
  hasPermission: (code: string) => boolean,
): NavSection[] =>
  sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.roles && (!role || !item.roles.includes(role))) return false;
        if (item.permission && !(role && ADMINS.includes(role)) && !hasPermission(item.permission)) return false;
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);
