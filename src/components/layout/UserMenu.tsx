import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { homePathForRole, profilePathForRole, PATHS } from '@/app/router/paths';
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth';

export const UserMenu = () => {
  const { user, role } = useCurrentUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 transition hover:border-brand-300"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user.full_name} size="sm" />
        <span className="hidden text-left sm:block">
          <span className="block max-w-[140px] truncate text-xs font-bold text-slate-800">{user.full_name}</span>
          <span className="block text-[10px] text-slate-400">{user.role_display}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 animate-fade-in rounded-2xl border border-slate-100 bg-white py-1 shadow-xl" role="menu" onClick={() => setOpen(false)}>
          <div className="border-b border-slate-100 px-4 py-2.5">
            <p className="truncate text-xs font-semibold text-slate-800">{user.full_name}</p>
            <p className="truncate text-[11px] text-slate-400">{user.email}</p>
          </div>
          <Link to={homePathForRole(role)} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50" role="menuitem">
            <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" /> Dashboard
          </Link>
          <Link to={profilePathForRole(role)} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50" role="menuitem">
            <UserRound className="h-3.5 w-3.5 text-slate-400" /> Profile
          </Link>
          <Link to={PATHS.home} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50" role="menuitem">
            <Globe className="h-3.5 w-3.5 text-slate-400" /> Public website
          </Link>
          <div className="my-1 border-t border-slate-100" />
          <button type="button" onClick={() => logout.mutate()} className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50" role="menuitem">
            <LogOut className="h-3.5 w-3.5" /> {logout.isPending ? 'Signing out…' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
};
