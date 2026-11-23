import { useLocation } from 'react-router-dom';
import { PATHS, portalLinks, type PortalKind } from '@/app/router/paths';

/** Resolves the portal the current route belongs to so shared staff pages can link correctly. */
export const usePortal = (): { portal: PortalKind; links: ReturnType<typeof portalLinks> } => {
  const { pathname } = useLocation();
  const portal: PortalKind = pathname.startsWith(PATHS.student.root)
    ? 'student'
    : pathname.startsWith(PATHS.faculty_portal.root)
      ? 'faculty'
      : 'admin';
  return { portal, links: portalLinks(portal) };
};
