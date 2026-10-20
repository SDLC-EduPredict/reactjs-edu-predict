import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Avatar, EmptyState, ErrorState, Pagination, SearchInput, Skeleton } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { usePublicFaculty } from '../hooks/useFaculty';

const PAGE_SIZE = 12;

export const FacultyDirectoryPage = () => {
  useDocumentTitle('Our Faculty & Trainers');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(search);
  const faculty = usePublicFaculty({ search: debounced, page, page_size: PAGE_SIZE });

  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-brand-50/70 to-page py-12">
        <div className="container-page flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Trainers</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Meet our faculty</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Industry practitioners and academic mentors behind every course.</p>
          </div>
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name or expertise…"
          />
        </div>
      </section>
      <div className="container-page mt-10">
        {faculty.isError ? (
          <ErrorState message={getErrorMessage(faculty.error)} onRetry={() => faculty.refetch()} />
        ) : faculty.isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-64" />
            ))}
          </div>
        ) : faculty.data.results.length === 0 ? (
          <EmptyState title="No faculty members found" />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {faculty.data.results.map((member) => (
                <Link
                  key={member.id}
                  to={PATHS.facultyMember(member.id)}
                  className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <Avatar name={member.full_name} src={member.photo} size="xl" className="rounded-2xl" />
                  <h2 className="mt-4 text-base font-bold text-slate-900 group-hover:text-brand-700">{member.full_name}</h2>
                  <p className="text-xs font-semibold text-brand-600">{member.designation}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-500">{member.expertise}</p>
                  <span className="mt-4 inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    <BookOpen className="h-3.5 w-3.5" /> {member.course_count} course{member.course_count === 1 ? '' : 's'}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white">
              <Pagination page={page} pageSize={PAGE_SIZE} count={faculty.data.count} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FacultyDirectoryPage;
