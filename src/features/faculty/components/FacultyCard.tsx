import { Button } from '@/components/ui';
import { resolveMediaUrl } from '@/lib/utils/format';
import type { PublicFaculty } from '../types';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const FacultyCard = ({ member, onView }: { member: PublicFaculty; onView: () => void }) => {
  const photo = resolveMediaUrl(member.photo);
  return (
    <div data-reveal="" className="h-full">
      <article className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-3xl bg-[#f0eefc] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
        <div className="flex flex-1 justify-center overflow-hidden">
          {photo ? (
            <img
              src={photo}
              alt={member.full_name}
              loading="lazy"
              className="h-72 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="mt-20 font-display text-6xl font-semibold text-brand-700/30 transition-transform duration-500 group-hover:scale-110">
              {initials(member.full_name)}
            </span>
          )}
        </div>
        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-4 text-center shadow-card">
          <h3 className="truncate font-display text-base font-semibold text-slate-900">{member.full_name}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">{member.designation || 'Faculty Member'}</p>
          <Button size="sm" fullWidth className="mt-3 h-9" onClick={onView}>
            View Profile
          </Button>
        </div>
      </article>
    </div>
  );
};
