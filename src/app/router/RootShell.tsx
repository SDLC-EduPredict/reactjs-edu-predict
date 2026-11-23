import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/feedback/Toaster';
import { CourseFinderModal } from '@/features/courses/components/CourseFinderModal';
import { CoursePreviewModal } from '@/features/courses/components/CoursePreviewModal';
import { SessionWatcher } from './guards';

export const RootShell = () => (
  <>
    <SessionWatcher />
    <Outlet />
    <CoursePreviewModal />
    <CourseFinderModal />
    <Toaster />
  </>
);
