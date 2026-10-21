import type { Course, Department, Subject } from './types';

export const ENGLISH_ID = 'english';

export const subjects: Subject[] = [
  { id: 'english', name: 'English Language', color: 'english' },
  { id: 'mathematics', name: 'Mathematics', color: 'science' },
  { id: 'physics', name: 'Physics', color: 'science' },
  { id: 'chemistry', name: 'Chemistry', color: 'science' },
  { id: 'biology', name: 'Biology', color: 'science' },
  { id: 'agric', name: 'Agricultural Science', color: 'science' },
  { id: 'geography', name: 'Geography', color: 'science' },
  { id: 'further-maths', name: 'Further Mathematics', color: 'science' },
  { id: 'computer', name: 'Computer Studies', color: 'science' },
  { id: 'economics', name: 'Economics', color: 'social' },
  { id: 'government', name: 'Government', color: 'social' },
  { id: 'commerce', name: 'Commerce', color: 'social' },
  { id: 'accounts', name: 'Financial Accounting', color: 'social' },
  { id: 'crs', name: 'CRS', color: 'arts' },
  { id: 'literature', name: 'Literature in English', color: 'arts' },
  { id: 'history', name: 'History', color: 'arts' },
];

export const departments: Department[] = [
  { id: 'science', name: 'Science', blurb: 'Physics, Chemistry, Biology, Maths', subjectIds: ['physics', 'chemistry', 'biology', 'mathematics', 'agric', 'geography', 'further-maths', 'computer'] },
  { id: 'social', name: 'Social Science', blurb: 'Economics, Government, Commerce, Accounting', subjectIds: ['economics', 'government', 'commerce', 'accounts', 'mathematics', 'geography', 'crs'] },
  { id: 'arts', name: 'Arts', blurb: 'Literature, Government, CRS, History', subjectIds: ['literature', 'government', 'crs', 'history', 'geography', 'economics'] },
];

/** Common combinations. Guidance only: students should check what their school or university requires. */
export const courses: Course[] = [
  { id: 'medicine', name: 'Medicine and Surgery', department: 'science', suggested: ['biology', 'chemistry', 'physics'] },
  { id: 'computer-science', name: 'Computer Science', department: 'science', suggested: ['mathematics', 'physics', 'chemistry'], note: 'Maths and Physics are required. Pick one more: Chemistry is a common choice.' },
  { id: 'mech-eng', name: 'Mechanical Engineering', department: 'science', suggested: ['mathematics', 'physics', 'chemistry'] },
  { id: 'pharmacy', name: 'Pharmacy', department: 'science', suggested: ['biology', 'chemistry', 'physics'] },
  { id: 'nursing', name: 'Nursing', department: 'science', suggested: ['biology', 'chemistry', 'physics'] },
  { id: 'economics', name: 'Economics', department: 'social', suggested: ['economics', 'mathematics', 'government'] },
  { id: 'accounting', name: 'Accounting', department: 'social', suggested: ['accounts', 'mathematics', 'economics'] },
  { id: 'political-science', name: 'Political Science', department: 'social', suggested: ['government', 'economics', 'geography'] },
  { id: 'law', name: 'Law', department: 'arts', suggested: ['literature', 'government', 'history'] },
  { id: 'mass-comm', name: 'Mass Communication', department: 'arts', suggested: ['literature', 'government', 'crs'] },
  { id: 'english-lit', name: 'English and Literary Studies', department: 'arts', suggested: ['literature', 'government', 'history'] },
];

export const subjectById = (id: string) => subjects.find(s => s.id === id);
export const departmentById = (id: string) => departments.find(d => d.id === id);
export const courseById = (id: string) => courses.find(c => c.id === id);

export function searchCourses(query: string, department?: string): Course[] {
  const q = query.trim().toLowerCase();
  return courses.filter(c => (!department || c.department === department) && (!q || c.name.toLowerCase().includes(q)));
}

/** Timed mock test: a fixed number of random questions per subject, with a set time per question. */
export const MOCK_FORMAT = {
  questionsPerSubject: 20,
  secondsPerQuestion: 45,
} as const;
