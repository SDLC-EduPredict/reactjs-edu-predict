import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, BrainCircuit, HeartHandshake } from 'lucide-react';
import { EmptyState, ErrorState, Pagination, SearchInput, Skeleton } from '@/components/ui';
import { CtaBand } from '@/components/domain/CtaBand';
import { SectionHeading } from '@/components/domain/SectionHeading';
import { ButtonLink } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { FacultyCard } from '@/features/faculty/components/FacultyCard';
import { FacultyProfileModal } from '@/features/faculty/components/FacultyProfileModal';
import { usePublicFaculty } from '@/features/faculty/hooks/useFaculty';

const PAGE_SIZE = 8;

const WATCHLIST = [
  { name: 'Learner A', course: 'Data Science', score: 52.4, reason: 'Attendance below 65%' },
  { name: 'Learner B', course: 'Python + Django', score: 58.1, reason: 'Two assignments pending' },
  { name: 'Learner C', course: 'Cloud DevOps', score: 61.7, reason: 'Mock test average dropping' },
];

const FacultyPage = () => {
  useDocumentTitle('Faculty & Mentors');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(id ?? null);
  const closeProfile = () => {
    setSelected(null);
    if (id) navigate(PATHS.faculty, { replace: true });
  };
  const debounced = useDebouncedValue(search);
  const faculty = usePublicFaculty({ page, page_size: PAGE_SIZE, search: debounced });

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/70 to-white py-14 sm:py-20">
        <div className="container-page text-center">
          <span className="eyebrow">Our Faculty</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Meet Your Academic &amp; <span className="highlight">Engineering Mentors</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Industry practitioners who teach, review and mentor — guided by live academic data.</p>
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name or expertise…"
            className="mx-auto mt-8 max-w-md"
          />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          {faculty.isError ? (
            <ErrorState message={getErrorMessage(faculty.error)} onRetry={() => void faculty.refetch()} />
          ) : faculty.isPending ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-72 rounded-3xl" />
              ))}
            </div>
          ) : faculty.data.results.length === 0 ? (
            <EmptyState title="No mentors found" description="Try a different name or expertise." />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {faculty.data.results.map((member) => (
                  <FacultyCard key={member.id} member={member} onView={() => setSelected(member.id)} />
                ))}
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100">
                <Pagination page={page} pageSize={PAGE_SIZE} count={faculty.data.count} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-canvas py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Mentorship Model"
              title={
                <>
                  Data-Driven Guidance, <span className="highlight">Human Empathy</span>
                </>
              }
              description="Mentors see an early-warning watchlist powered by the Linear Regression engine and reach out before grades slip."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
                <BrainCircuit className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Predictive alerts</p>
                <p className="text-xs text-slate-500">Weekly forecasts flag at-risk learners automatically.</p>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
                <HeartHandshake className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-semibold text-slate-900">1:1 guidance sessions</p>
                <p className="text-xs text-slate-500">Request a session from any mentor&apos;s profile.</p>
              </div>
            </div>
          </div>
          <div className="navy-panel rounded-3xl p-6 text-white shadow-lift">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Mentor Watchlist</p>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-1 text-[10px] font-bold text-rose-200">Needs attention</span>
            </div>
            <ul className="mt-5 space-y-3">
              {WATCHLIST.map((item) => (
                <li key={item.name} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-sun-300" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="truncate text-[11px] text-white/60">
                      {item.course} · {item.reason}
                    </p>
                  </div>
                  <span className="font-display text-lg font-bold text-sun-300">{item.score}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-white/50">Illustrative preview — live watchlists are visible inside the faculty portal.</p>
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Learn With a <span className="highlight-white">Mentor</span> Who Knows Your Data
          </>
        }
        description="Enrol in a course to get matched with a faculty mentor and your own predicted score."
        action={
          <ButtonLink to={PATHS.register} size="lg">
            Register Now
          </ButtonLink>
        }
      />
      <FacultyProfileModal facultyId={selected} onClose={closeProfile} />
    </>
  );
};

export default FacultyPage;
