import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  CalendarCheck2,
  ClipboardList,
  Cpu,
  FileText,
  FolderTree,
  GraduationCap,
  Inbox,
  LayoutGrid,
  LineChart,
  Megaphone,
  Settings,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react';
import { PATHS, type PortalKind } from '@/app/router/paths';

export type BadgeKey = 'unread' | 'pendingAssignments' | 'courses' | 'attendance' | 'toGrade' | 'pendingFaculty' | 'attention';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: BadgeKey;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const STUDENT_NAV: NavSection[] = [
  {
    title: 'Student Workspace',
    items: [
      { to: PATHS.student.dashboard, label: 'Overview Dashboard', icon: LayoutGrid },
      { to: PATHS.student.courses, label: 'My Courses', icon: BookOpen, badge: 'courses' },
      { to: PATHS.student.attendance, label: 'Attendance', icon: CalendarCheck2, badge: 'attendance' },
      { to: PATHS.student.assignments, label: 'Assignments', icon: FileText, badge: 'pendingAssignments' },
      { to: PATHS.student.results, label: 'Tests & Results', icon: Award },
    ],
  },
  {
    title: 'Intelligence & Account',
    items: [
      { to: PATHS.student.performance, label: 'My Performance', icon: LineChart },
      { to: PATHS.student.prediction, label: 'ML Score Predictor', icon: BrainCircuit },
      { to: PATHS.student.notifications, label: 'Notifications', icon: Bell, badge: 'unread' },
      { to: PATHS.student.profile, label: 'Student Profile', icon: UserRound },
    ],
  },
];

const FACULTY_NAV: NavSection[] = [
  {
    title: 'Faculty Workspace',
    items: [
      { to: PATHS.faculty_portal.dashboard, label: 'Overview Dashboard', icon: LayoutGrid },
      { to: PATHS.faculty_portal.batches, label: 'My Batches', icon: BookOpen, badge: 'courses' },
      { to: PATHS.faculty_portal.attendance, label: 'Student Attendance', icon: CalendarCheck2, badge: 'attendance' },
      { to: PATHS.faculty_portal.assignments, label: 'Assignments', icon: FileText, badge: 'toGrade' },
      { to: PATHS.faculty_portal.assessments, label: 'Assessments & Marks', icon: Award },
      { to: PATHS.faculty_portal.students, label: 'My Students', icon: Users, badge: 'attention' },
    ],
  },
  {
    title: 'Intelligence & Account',
    items: [
      { to: PATHS.faculty_portal.performance, label: 'Performance Tracking', icon: LineChart },
      { to: PATHS.faculty_portal.predictions, label: 'ML Score Predictor', icon: BrainCircuit },
      { to: PATHS.faculty_portal.notifications, label: 'Notifications', icon: Bell, badge: 'unread' },
      { to: PATHS.faculty_portal.profile, label: 'Faculty Profile', icon: UserRound },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    title: 'Administration',
    items: [
      { to: PATHS.admin.dashboard, label: 'Overview Dashboard', icon: LayoutGrid },
      { to: PATHS.admin.students, label: 'Students', icon: Users },
      { to: PATHS.admin.faculty, label: 'Faculty', icon: UsersRound, badge: 'pendingFaculty' },
      { to: PATHS.admin.categories, label: 'Categories', icon: FolderTree },
      { to: PATHS.admin.courses, label: 'Courses', icon: GraduationCap },
      { to: PATHS.admin.enrolments, label: 'Enrolments', icon: ClipboardList },
    ],
  },
  {
    title: 'Academics',
    items: [
      { to: PATHS.admin.attendance, label: 'Attendance', icon: CalendarCheck2 },
      { to: PATHS.admin.assignments, label: 'Assignments', icon: FileText, badge: 'toGrade' },
      { to: PATHS.admin.assessments, label: 'Assessments & Marks', icon: Award },
      { to: PATHS.admin.performance, label: 'Performance', icon: LineChart, badge: 'attention' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { to: PATHS.admin.predictions, label: 'ML Predictions', icon: BrainCircuit },
      { to: PATHS.admin.models, label: 'ML Models', icon: Cpu },
      { to: PATHS.admin.reports, label: 'Reports & Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Communication & System',
    items: [
      { to: PATHS.admin.notifications, label: 'Send Notifications', icon: Megaphone },
      { to: PATHS.admin.inbox, label: 'My Inbox', icon: Inbox, badge: 'unread' },
      { to: PATHS.admin.settings, label: 'Settings', icon: Settings },
    ],
  },
];

export const NAV_BY_PORTAL: Record<PortalKind, NavSection[]> = {
  student: STUDENT_NAV,
  faculty: FACULTY_NAV,
  admin: ADMIN_NAV,
};

export const WORKSPACE_LABEL: Record<PortalKind, string> = {
  student: 'Student Workspace',
  faculty: 'Faculty Workspace',
  admin: 'Administration',
};
