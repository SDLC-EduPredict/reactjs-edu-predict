import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, BookOpen, BrainCircuit, CalendarCheck2, ClipboardList, FileText, FolderTree, GraduationCap, TrendingUp, Users, UsersRound } from 'lucide-react';
import { humanize } from '@/lib/utils/format';

const KNOWN: Record<string, { label: string; icon: LucideIcon; tone: 'brand' | 'green' | 'amber' | 'rose' | 'violet' | 'sky' }> = {
  total_students: { label: 'Students', icon: Users, tone: 'brand' },
  students: { label: 'Students', icon: Users, tone: 'brand' },
  active_students: { label: 'Active students', icon: Users, tone: 'brand' },
  total_faculty: { label: 'Faculty', icon: UsersRound, tone: 'violet' },
  faculty: { label: 'Faculty', icon: UsersRound, tone: 'violet' },
  pending_faculty: { label: 'Faculty awaiting approval', icon: UsersRound, tone: 'amber' },
  total_courses: { label: 'Courses', icon: GraduationCap, tone: 'sky' },
  courses: { label: 'Courses', icon: GraduationCap, tone: 'sky' },
  active_courses: { label: 'Active courses', icon: GraduationCap, tone: 'sky' },
  total_categories: { label: 'Categories', icon: FolderTree, tone: 'sky' },
  total_enrolments: { label: 'Enrolments', icon: ClipboardList, tone: 'green' },
  active_enrolments: { label: 'Active enrolments', icon: ClipboardList, tone: 'green' },
  pending_enrolments: { label: 'Pending enrolments', icon: ClipboardList, tone: 'amber' },
  average_attendance: { label: 'Average attendance', icon: CalendarCheck2, tone: 'green' },
  avg_attendance: { label: 'Average attendance', icon: CalendarCheck2, tone: 'green' },
  total_assignments: { label: 'Assignments', icon: FileText, tone: 'violet' },
  pending_submissions: { label: 'Submissions to grade', icon: FileText, tone: 'amber' },
  total_assessments: { label: 'Assessments', icon: BookOpen, tone: 'violet' },
  average_predicted_score: { label: 'Avg predicted score', icon: BrainCircuit, tone: 'brand' },
  avg_predicted_score: { label: 'Avg predicted score', icon: BrainCircuit, tone: 'brand' },
  total_predictions: { label: 'Predictions', icon: BrainCircuit, tone: 'brand' },
  students_needing_attention: { label: 'Needs attention', icon: AlertTriangle, tone: 'rose' },
  needs_attention: { label: 'Needs attention', icon: AlertTriangle, tone: 'rose' },
};

export const describeStat = (key: string) => KNOWN[key] ?? { label: humanize(key), icon: TrendingUp, tone: 'brand' as const };

export const isPercentStat = (key: string) => /attendance|percentage|rate/.test(key);
