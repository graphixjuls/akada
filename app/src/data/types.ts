export type DepartmentId = 'science' | 'social' | 'arts';

/** Subject colour families from the design system (Science = mint, Social = lavender, Arts = butter, English = blue). */
export type SubjectColor = 'science' | 'social' | 'arts' | 'english';

export interface Subject {
  id: string;
  name: string;
  color: SubjectColor;
}

export interface Department {
  id: DepartmentId;
  name: string;
  /** Subjects students in this department usually pick from (English is always added). */
  subjectIds: string[];
  blurb: string;
}

export interface Course {
  id: string;
  name: string;
  department: DepartmentId;
  /** Subjects that usually suit this course (added to English and Maths). Students can change any of them. */
  suggested: [string, string, string];
  /** Shown under the suggestion, e.g. which subjects are strictly required. */
  note?: string;
}

export type ClassLevel = 'SS1' | 'SS2' | 'SS3';

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  /** The class in which the topic is usually taught. */
  level: ClassLevel;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  text: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface QuestionBank {
  notice: string;
  topics: Topic[];
  questions: Question[];
}
