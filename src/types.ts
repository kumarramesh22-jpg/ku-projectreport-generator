export type Course = 'B.Tech' | 'MBA';

export interface ProjectSubmission {
  id: string;
  studentName: string;
  hallTicketNumber: string;
  course: Course;
  specialization: string;
  projectTopic: string;
  createdAt: number;
  updatedAt: number;
}

export interface GeneratedChapter {
  number: number;
  title: string;
  subtitle: string;
  content: string;
}

export interface GeneratedReport {
  submissionId: string;
  chapters: GeneratedChapter[];
  generatedAt: number;
}

export interface CourseOption {
  value: Course;
  label: string;
  specializations: string[];
}

export const COURSES: CourseOption[] = [
  {
    value: 'B.Tech',
    label: 'B.Tech (Bachelor of Technology)',
    specializations: [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering',
      'Electrical & Electronics Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Information Technology',
      'Artificial Intelligence & Data Science',
    ],
  },
  {
    value: 'MBA',
    label: 'MBA (Master of Business Administration)',
    specializations: [
      'Finance',
      'Human Resource Management',
      'Marketing',
      'Operations Management',
      'International Business',
      'Business Analytics',
    ],
  },
];

export function getSpecializations(course: Course): string[] {
  return COURSES.find((c) => c.value === course)?.specializations ?? [];
}
