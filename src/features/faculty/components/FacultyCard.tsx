import { Avatar, Button } from '@/components/ui';
import type { PublicFaculty } from '../types';

export const FacultyCard = ({ member, onView }: { member: PublicFaculty; onView: () => void }) => (
  <div data-reveal="" className="h-full">
    <article className="group flex h-full flex-col items-center rounded-3xl bg-white p-5 text-center shadow-card ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lift">
      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold text-brand-700">
        {member.course_count} course{member.course_count === 1 ? '' : 's'}
      </span>
      <div className="my-4 rounded-full bg-gradient-to-br from-brand-100 to-sun-100 p-1.5">
        <Avatar
          name={member.full_name}
          src={member.photo}
          size="xl"
          className="h-20 w-20 text-2xl"
        />
      </div>
      <p className="text-[11px] font-semibold text-slate-500">
        {member.designation || 'Faculty Member'}
      </p>
      <h3 className="mt-1 font-display text-base font-semibold text-slate-900">
        {member.full_name}
      </h3>
      <p className="mt-1 line-clamp-2 min-h-8 text-xs text-slate-500">
        {member.expertise || 'ABC Academy mentor'}
      </p>
      <Button size="sm" fullWidth className="mt-4 h-9" onClick={onView}>
        View Profile
      </Button>
    </article>
  </div>
);
