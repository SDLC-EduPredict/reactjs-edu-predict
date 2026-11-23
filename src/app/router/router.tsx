/* eslint-disable react-refresh/only-export-components -- route table: lazy page components live beside the router config */
import { lazy, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { ADMIN_ROLES, type UserRole } from '@/types';
import { GuestOnly, RequireAuth, RequireRole } from './guards';
import { RootShell } from './RootShell';
import { PATHS, type PortalKind } from './paths';

// Public
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const FacultyPage = lazy(() => import('@/pages/FacultyPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Auth
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));

// Student portal
const StudentDashboardPage = lazy(() => import('@/features/students/pages/StudentDashboardPage'));
const StudentCoursesPage = lazy(() => import('@/features/enrolments/pages/StudentCoursesPage'));
const StudentAttendancePage = lazy(() => import('@/features/attendance/pages/StudentAttendancePage'));
const StudentAssignmentsPage = lazy(() => import('@/features/assignments/pages/StudentAssignmentsPage'));
const StudentResultsPage = lazy(() => import('@/features/assessments/pages/StudentResultsPage'));
const StudentPerformancePage = lazy(() => import('@/features/performance/pages/StudentPerformancePage'));
const StudentPredictionPage = lazy(() => import('@/features/predictions/pages/StudentPredictionPage'));
const StudentProfilePage = lazy(() => import('@/features/students/pages/StudentProfilePage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));

// Shared staff (faculty + admin)
const StaffAttendancePage = lazy(() => import('@/features/attendance/pages/StaffAttendancePage'));
const StaffAssignmentsPage = lazy(() => import('@/features/assignments/pages/StaffAssignmentsPage'));
const StaffAssessmentsPage = lazy(() => import('@/features/assessments/pages/StaffAssessmentsPage'));
const StaffPerformancePage = lazy(() => import('@/features/performance/pages/StaffPerformancePage'));
const StaffPredictionsPage = lazy(() => import('@/features/predictions/pages/StaffPredictionsPage'));

// Faculty portal
const FacultyDashboardPage = lazy(() => import('@/features/analytics/pages/FacultyDashboardPage'));
const FacultyBatchesPage = lazy(() => import('@/features/courses/pages/FacultyBatchesPage'));
const FacultyStudentsPage = lazy(() => import('@/features/analytics/pages/FacultyStudentsPage'));
const FacultyProfilePage = lazy(() => import('@/features/faculty/pages/FacultyProfilePage'));

// Admin portal
const AdminDashboardPage = lazy(() => import('@/features/analytics/pages/AdminDashboardPage'));
const AdminStudentsPage = lazy(() => import('@/features/students/pages/AdminStudentsPage'));
const AdminFacultyPage = lazy(() => import('@/features/faculty/pages/AdminFacultyPage'));
const AdminCategoriesPage = lazy(() => import('@/features/courses/pages/AdminCategoriesPage'));
const AdminCoursesPage = lazy(() => import('@/features/courses/pages/AdminCoursesPage'));
const AdminEnrolmentsPage = lazy(() => import('@/features/enrolments/pages/AdminEnrolmentsPage'));
const AdminModelsPage = lazy(() => import('@/features/predictions/pages/AdminModelsPage'));
const AdminReportsPage = lazy(() => import('@/features/reports/pages/AdminReportsPage'));
const AdminNotificationsPage = lazy(() => import('@/features/notifications/pages/AdminNotificationsPage'));
const AdminSettingsPage = lazy(() => import('@/features/settings/pages/AdminSettingsPage'));

const child = (path: string, root: string) => path.slice(root.length + 1);

const portal = (kind: PortalKind, root: string, roles: readonly UserRole[], home: string, routes: [string, ReactNode][]): RouteObject => ({
  path: root,
  element: (
    <RequireAuth>
      <RequireRole roles={roles}>
        <PortalLayout portal={kind} />
      </RequireRole>
    </RequireAuth>
  ),
  children: [
    { index: true, element: <Navigate to={home} replace /> },
    ...routes.map(([path, element]) => ({ path: child(path, root), element })),
    { path: '*', element: <Navigate to={home} replace /> },
  ],
});

const S = PATHS.student;
const F = PATHS.faculty_portal;
const A = PATHS.admin;

export const router = createBrowserRouter([
  {
    element: <RootShell />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: PATHS.about, element: <AboutPage /> },
          { path: PATHS.courses, element: <CoursesPage /> },
          { path: `${PATHS.courses}/:slug`, element: <CourseDetailPage /> },
          { path: PATHS.categories, element: <CategoriesPage /> },
          { path: PATHS.faculty, element: <FacultyPage /> },
          { path: `${PATHS.faculty}/:id`, element: <FacultyPage /> },
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
          { element: <RequireAuth />, children: [{ path: PATHS.verifyAccount, element: <VerifyEmailPage /> }] },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      portal('student', S.root, ['STUDENT'], S.dashboard, [
        [S.dashboard, <StudentDashboardPage />],
        [S.courses, <StudentCoursesPage />],
        [S.attendance, <StudentAttendancePage />],
        [S.assignments, <StudentAssignmentsPage />],
        [S.results, <StudentResultsPage />],
        [S.performance, <StudentPerformancePage />],
        [S.prediction, <StudentPredictionPage />],
        [S.notifications, <NotificationsPage />],
        [S.profile, <StudentProfilePage />],
      ]),
      portal('faculty', F.root, ['FACULTY'], F.dashboard, [
        [F.dashboard, <FacultyDashboardPage />],
        [F.batches, <FacultyBatchesPage />],
        [F.attendance, <StaffAttendancePage />],
        [F.assignments, <StaffAssignmentsPage />],
        [F.assessments, <StaffAssessmentsPage />],
        [F.students, <FacultyStudentsPage />],
        [F.performance, <StaffPerformancePage />],
        [F.predictions, <StaffPredictionsPage />],
        [F.notifications, <NotificationsPage />],
        [F.profile, <FacultyProfilePage />],
      ]),
      portal('admin', A.root, ADMIN_ROLES, A.dashboard, [
        [A.dashboard, <AdminDashboardPage />],
        [A.students, <AdminStudentsPage />],
        [A.faculty, <AdminFacultyPage />],
        [A.categories, <AdminCategoriesPage />],
        [A.courses, <AdminCoursesPage />],
        [A.enrolments, <AdminEnrolmentsPage />],
        [A.attendance, <StaffAttendancePage />],
        [A.assignments, <StaffAssignmentsPage />],
        [A.assessments, <StaffAssessmentsPage />],
        [A.performance, <StaffPerformancePage />],
        [A.predictions, <StaffPredictionsPage />],
        [A.models, <AdminModelsPage />],
        [A.reports, <AdminReportsPage />],
        [A.notifications, <AdminNotificationsPage />],
        [A.inbox, <NotificationsPage />],
        [A.settings, <AdminSettingsPage />],
      ]),
    ],
  },
]);
