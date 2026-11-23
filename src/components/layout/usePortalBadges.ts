import { useMemo } from 'react';
import type { PortalKind } from '@/app/router/paths';
import { useAdminDashboard, useFacultyDashboard } from '@/features/analytics/hooks/useAnalytics';
import { useMyAttendance } from '@/features/attendance/hooks/useAttendance';
import { useMyAssignments } from '@/features/assignments/hooks/useAssignments';
import { useMyCourses } from '@/features/enrolments/hooks/useEnrolments';
import { useUnreadCount } from '@/features/notifications/hooks/useNotifications';
import type { BadgeKey } from './navigation';

export type BadgeTone = 'navy' | 'lime' | 'sun' | 'rose';
export type PortalBadges = Partial<Record<BadgeKey, { text: string; tone: BadgeTone }>>;

const count = (value: number | undefined | null, tone: BadgeTone = 'navy') =>
  typeof value === 'number' && value > 0 ? { text: value > 99 ? '99+' : String(value), tone } : undefined;

const percent = (value: number | null | undefined) =>
  typeof value === 'number' ? { text: `${Math.round(value)}%`, tone: (value >= 75 ? 'lime' : 'rose') as BadgeTone } : undefined;

export const usePortalBadges = (portal: PortalKind): PortalBadges => {
  const unread = useUnreadCount();
  const faculty = useFacultyDashboard(portal === 'faculty');
  const isStudent = portal === 'student';
  const myCourses = useMyCourses(isStudent);
  const myAttendance = useMyAttendance(isStudent).data;
  const myAssignments = useMyAssignments(isStudent).data;
  const admin = useAdminDashboard(portal === 'admin').data;

  return useMemo<PortalBadges>(() => {
    const base: PortalBadges = { unread: count(unread.data, 'navy') };
    if (portal === 'faculty' && faculty.data) {
      return {
        ...base,
        courses: count(faculty.data.courses.length),
        attendance: percent(faculty.data.summary.average_attendance),
        toGrade: count(faculty.data.work.submissions_to_grade, 'sun'),
        attention: count(faculty.data.summary.students_needing_attention, 'rose'),
      };
    }
    if (portal === 'student') {
      const records = myAttendance ?? [];
      const totals = records.reduce(
        (acc, item) => ({ classes: acc.classes + item.summary.total_classes, attended: acc.attended + item.summary.present + item.summary.late }),
        { classes: 0, attended: 0 },
      );
      const pending = (myAssignments ?? []).reduce((acc, item) => acc + item.summary.not_submitted, 0);
      return {
        ...base,
        courses: count(myCourses.data?.length),
        attendance: totals.classes ? percent((totals.attended / totals.classes) * 100) : undefined,
        pendingAssignments: count(pending, 'sun'),
      };
    }
    if (portal === 'admin' && admin) {
      return {
        ...base,
        pendingFaculty: count(admin.people.pending_faculty_approvals, 'sun'),
        toGrade: count(admin.academic_records.submissions_to_grade, 'sun'),
        attention: count(admin.summary.enrolments_needing_attention, 'rose'),
      };
    }
    return base;
  }, [portal, unread.data, faculty.data, myCourses.data, myAttendance, myAssignments, admin]);
};
