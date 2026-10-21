import type { Question } from '../data/types';
import { mockScore } from './scoring';

/** Timed mock test answer state. Serialisable so it can be saved and resumed after the app closes. */
export interface ExamState {
  questionIds: string[];
  /** questionId → chosen option index */
  answers: Record<string, number>;
  flagged: Record<string, true>;
  current: number;
  startedAt: number;
  durationMs: number;
  submittedAt: number | null;
}

export type ExamAction =
  | { type: 'select'; questionId: string; option: number }
  | { type: 'toggleFlag'; questionId: string }
  | { type: 'goto'; index: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'submit'; at: number };

export function createExam(questionIds: string[], startedAt: number, durationMs: number): ExamState {
  return { questionIds, answers: {}, flagged: {}, current: 0, startedAt, durationMs, submittedAt: null };
}

export function examReducer(state: ExamState, action: ExamAction): ExamState {
  if (state.submittedAt !== null && action.type !== 'goto') return state; // answers are locked after submitting
  const last = state.questionIds.length - 1;
  switch (action.type) {
    case 'select':
      if (!state.questionIds.includes(action.questionId)) return state;
      return { ...state, answers: { ...state.answers, [action.questionId]: action.option } };
    case 'toggleFlag': {
      const flagged = { ...state.flagged };
      if (flagged[action.questionId]) delete flagged[action.questionId];
      else flagged[action.questionId] = true;
      return { ...state, flagged };
    }
    case 'goto':
      return { ...state, current: Math.min(Math.max(action.index, 0), last) };
    case 'next':
      return { ...state, current: Math.min(state.current + 1, last) };
    case 'prev':
      return { ...state, current: Math.max(state.current - 1, 0) };
    case 'submit':
      return { ...state, submittedAt: action.at };
  }
}

export function examCounts(state: ExamState) {
  const answered = state.questionIds.filter(id => state.answers[id] !== undefined).length;
  const flagged = state.questionIds.filter(id => state.flagged[id]).length;
  return { answered, flagged, unanswered: state.questionIds.length - answered, total: state.questionIds.length };
}

export type NumberState = 'Current' | 'Flagged' | 'Answered' | 'Unanswered';

/** State shown on a Question Number cell in the navigator. Current wins, then Flagged. */
export function numberState(state: ExamState, index: number): NumberState {
  const id = state.questionIds[index];
  if (index === state.current) return 'Current';
  if (state.flagged[id]) return 'Flagged';
  if (state.answers[id] !== undefined) return 'Answered';
  return 'Unanswered';
}

/** The subjects in a test, in the order their questions appear. */
export function examSubjects(state: ExamState, bank: Question[]): string[] {
  const byId = new Map(bank.map(q => [q.id, q.subjectId]));
  return [...new Set(state.questionIds.map(id => byId.get(id)).filter((s): s is string => !!s))];
}

export function gradeExam(state: ExamState, bank: Question[], subjectOrder: string[]) {
  const byId = new Map(bank.map(q => [q.id, q]));
  const results = subjectOrder.map(subjectId => {
    const qs = state.questionIds.map(id => byId.get(id)!).filter(q => q && q.subjectId === subjectId);
    const correct = qs.filter(q => state.answers[q.id] === q.answerIndex).length;
    return { subjectId, correct, total: qs.length };
  });
  const wrong = state.questionIds.filter(id => state.answers[id] !== undefined && state.answers[id] !== byId.get(id)?.answerIndex);
  return { ...mockScore(results), wrongIds: wrong, counts: examCounts(state) };
}
