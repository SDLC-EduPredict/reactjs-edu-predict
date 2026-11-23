import { Select } from '@/components/ui';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useFacultyDashboard } from '@/features/analytics/hooks/useAnalytics';
import { useAdminCourses } from '@/features/courses/hooks/useCourses';

/** Courses visible to the signed-in staff member: own batches for faculty, every course for admins. */
export const useStaffCourseOptions = () => {
  const { role } = useCurrentUser();
  const isFaculty = role === 'FACULTY';
  const faculty = useFacultyDashboard(isFaculty);
  const admin = useAdminCourses({ page: 1, page_size: 100 }, !isFaculty);
  const courses = isFaculty
    ? (faculty.data?.courses ?? []).map((course) => ({ id: course.id, title: course.title }))
    : (admin.data?.results ?? []).map((course) => ({ id: course.id, title: course.title }));
  return {
    courses,
    options: courses.map((course) => ({ value: course.id, label: course.title })),
    isPending: isFaculty ? faculty.isPending : admin.isPending,
  };
};

interface StaffCourseSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const StaffCourseSelect = ({ value, onChange, label, placeholder = 'All courses', className }: StaffCourseSelectProps) => {
  const { options } = useStaffCourseOptions();
  return (
    <Select
      aria-label={label ?? 'Course'}
      label={label}
      containerClassName={className}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      options={options}
    />
  );
};
