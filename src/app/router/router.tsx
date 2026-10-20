import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { ADMIN_ROLES, STAFF_ROLES } from '@/types';
import { GuestOnly, RequireAuth, RequireRole } from './guards';
import { RootShell } from './RootShell';
import { PATHS } from './paths';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CourseListingPage = lazy(() => import('@/features/courses/pages/CourseListingPage'));
const CourseDetailPage = lazy(() => import('@/features/courses/pages/CourseDetailPage'));
const CategoriesPage = lazy(() => import('@/features/courses/pages/CategoriesPage'));
const FacultyDirectoryPage = lazy(() => import('@/features/faculty/pages/FacultyDirectoryPage'));
const FacultyDetailPage = lazy(() => import('@/features/faculty/pages/FacultyDetailPage'));

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));

const StudentDashboardPage = lazy(() => import('@/features/dashboard/pages/StudentDashboardPage'));
const StudentProfilePage = lazy(() => import('@/features/students/pages/StudentProfilePage'));
const StudentCoursesPage = lazy(() => import('@/features/enrolments/pages/StudentCoursesPage'));
const StudentAttendancePage = lazy(() => import('@/features/attendance/pages/StudentAttendancePage'));
const StudentAssignmentsPage = lazy(() => import('@/features/assignments/pages/StudentAssignmentsPage'));
const StudentResultsPage = lazy(() => import('@/features/assessments/pages/StudentResultsPage'));
const StudentPerformancePage = lazy(() => import('@/features/performance/pages/StudentPerformancePage'));
const StudentPredictionPage = lazy(() => import('@/features/predictions/pages/StudentPredictionPage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));

const StaffDashboardPage = lazy(() => import('@/features/dashboard/pages/StaffDashboardPage'));
const StudentManagementPage = lazy(() => import('@/features/students/pages/StudentManagementPage'));
const FacultyManagementPage = lazy(() => import('@/features/faculty/pages/FacultyManagementPage'));
const CourseManagementPage = lazy(() => import('@/features/courses/pages/CourseManagementPage'));
const CategoryManagementPage = lazy(() => import('@/features/courses/pages/CategoryManagementPage'));
const EnrolmentManagementPage = lazy(() => import('@/features/enrolments/pages/EnrolmentManagementPage'));
const AttendanceManagementPage = lazy(() => import('@/features/attendance/pages/AttendanceManagementPage'));
const AssignmentManagementPage = lazy(() => import('@/features/assignments/pages/AssignmentManagementPage'));
const AssessmentManagementPage = lazy(() => import('@/features/assessments/pages/AssessmentManagementPage'));
const PerformanceMonitoringPage = lazy(() => import('@/features/performance/pages/PerformanceMonitoringPage'));
const MLPredictionDashboardPage = lazy(() => import('@/features/predictions/pages/MLPredictionDashboardPage'));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'));
const AdminNotificationsPage = lazy(() => import('@/features/notifications/pages/AdminNotificationsPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));

const strip = (path: string, root: string) => path.replace(`${root}/`, '');

export const router = createBrowserRouter([
  {
    element: <RootShell />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: PATHS.about, element: <AboutPage /> },
          { path: PATHS.courses, element: <CourseListingPage /> },
          { path: `${PATHS.courses}/:slug`, element: <CourseDetailPage /> },
          { path: PATHS.categories, element: <CategoriesPage /> },
          { path: PATHS.faculty, element: <FacultyDirectoryPage /> },
          { path: `${PATHS.faculty}/:id`, element: <FacultyDetailPage /> },
          { path: PATHS.contact, element: <ContactPage /> },
          {
            element: <GuestOnly />,
            children: [
              { path: PATHS.login, element: <LoginPage /> },
              { path: PATHS.register, element: <RegisterPage /> },
              { path: PATHS.forgotPassword, element: <ForgotPasswordPage /> },
              { path: PATHS.resetPassword, element: <ResetPasswordPage /> },
            ],
          },
          {
            element: <RequireAuth />,
            children: [{ path: PATHS.verifyEmail, element: <VerifyEmailPage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        path: PATHS.student.root,
        element: (
          <RequireAuth>
            <RequireRole roles={['STUDENT']}>
              <PortalLayout portal="student" />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to={PATHS.student.dashboard} replace /> },
          { path: strip(PATHS.student.dashboard, PATHS.student.root), element: <StudentDashboardPage /> },
          { path: strip(PATHS.student.profile, PATHS.student.root), element: <StudentProfilePage /> },
          { path: strip(PATHS.student.courses, PATHS.student.root), element: <StudentCoursesPage /> },
          { path: strip(PATHS.student.attendance, PATHS.student.root), element: <StudentAttendancePage /> },
          { path: strip(PATHS.student.assignments, PATHS.student.root), element: <StudentAssignmentsPage /> },
          { path: strip(PATHS.student.results, PATHS.student.root), element: <StudentResultsPage /> },
          { path: strip(PATHS.student.performance, PATHS.student.root), element: <StudentPerformancePage /> },
          { path: strip(PATHS.student.prediction, PATHS.student.root), element: <StudentPredictionPage /> },
          { path: strip(PATHS.student.notifications, PATHS.student.root), element: <NotificationsPage /> },
          { path: '*', element: <Navigate to={PATHS.student.dashboard} replace /> },
        ],
      },
      {
        path: PATHS.admin.root,
        element: (
          <RequireAuth>
            <RequireRole roles={STAFF_ROLES}>
              <PortalLayout portal="staff" />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to={PATHS.admin.dashboard} replace /> },
          { path: strip(PATHS.admin.dashboard, PATHS.admin.root), element: <StaffDashboardPage /> },
          { path: strip(PATHS.admin.attendance, PATHS.admin.root), element: <AttendanceManagementPage /> },
          { path: strip(PATHS.admin.assignments, PATHS.admin.root), element: <AssignmentManagementPage /> },
          { path: strip(PATHS.admin.assessments, PATHS.admin.root), element: <AssessmentManagementPage /> },
          { path: strip(PATHS.admin.performance, PATHS.admin.root), element: <PerformanceMonitoringPage /> },
          { path: strip(PATHS.admin.predictions, PATHS.admin.root), element: <MLPredictionDashboardPage /> },
          { path: strip(PATHS.admin.reports, PATHS.admin.root), element: <ReportsPage /> },
          { path: strip(PATHS.admin.notifications, PATHS.admin.root), element: <AdminNotificationsPage /> },
          { path: `${strip(PATHS.admin.notifications, PATHS.admin.root)}/inbox`, element: <NotificationsPage /> },
          { path: strip(PATHS.admin.settings, PATHS.admin.root), element: <SettingsPage /> },
          {
            element: <RequireRole roles={ADMIN_ROLES} />,
            children: [
              { path: strip(PATHS.admin.students, PATHS.admin.root), element: <StudentManagementPage /> },
              { path: strip(PATHS.admin.faculty, PATHS.admin.root), element: <FacultyManagementPage /> },
              { path: strip(PATHS.admin.courses, PATHS.admin.root), element: <CourseManagementPage /> },
              { path: strip(PATHS.admin.categories, PATHS.admin.root), element: <CategoryManagementPage /> },
              { path: strip(PATHS.admin.enrolments, PATHS.admin.root), element: <EnrolmentManagementPage /> },
            ],
          },
          { path: '*', element: <Navigate to={PATHS.admin.dashboard} replace /> },
        ],
      },
    ],
  },
]);
