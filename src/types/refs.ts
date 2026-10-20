export interface CategoryRef {
  id: number;
  name: string;
  slug: string;
}

export interface CourseRef {
  id: number;
  title: string;
  slug: string;
}

export interface FacultyRef {
  id: string;
  full_name: string;
  designation: string;
  expertise: string;
  bio: string;
  photo: string | null;
}

export interface StudentRef {
  id: number;
  student_code?: string;
  full_name: string;
  email?: string;
}

export type PerformanceIndicator = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_ATTENTION';
