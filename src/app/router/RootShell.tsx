import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/feedback/Toaster';
import { SessionWatcher } from './guards';

export const RootShell = () => (
  <>
    <SessionWatcher />
    <Outlet />
    <Toaster />
  </>
);
