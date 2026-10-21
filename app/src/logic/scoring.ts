export interface SubjectResult {
  subjectId: string;
  correct: number;
  total: number;
}

/** Whole-number percentage, 0 when there is nothing to score. */
export function percent(correct: number, total: number): number {
  if (total <= 0) return 0;
  const clamped = Math.min(Math.max(correct, 0), total);
  return Math.round((clamped / total) * 100);
}

/** Mock test score: a percentage for each subject and an overall percentage across all questions. */
export function mockScore(results: SubjectResult[]) {
  const perSubject = results.map(r => ({ ...r, score: percent(r.correct, r.total) }));
  const correct = results.reduce((sum, r) => sum + r.correct, 0);
  const total = results.reduce((sum, r) => sum + r.total, 0);
  return { perSubject, total: percent(correct, total), max: 100 };
}

/** Practice summary: right/wrong count and accuracy as a whole percentage. */
export function practiceSummary(outcomes: boolean[]) {
  const total = outcomes.length;
  const correct = outcomes.filter(Boolean).length;
  return { correct, total, accuracy: percent(correct, total) };
}
