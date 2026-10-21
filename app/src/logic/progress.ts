import type { Question } from '../data/types';

/** Consecutive practice days ending today (or yesterday, so the streak survives until tonight). */
export function streak(practiceDays: string[], today: string): number {
  const days = new Set(practiceDays);
  const step = (iso: string) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };
  let cursor = days.has(today) ? today : step(today);
  let count = 0;
  while (days.has(cursor)) { count++; cursor = step(cursor); }
  return count;
}

type History = Record<string, { correct: boolean; at: number }>;

/** Share of a subject's questions answered at least once (0–1). */
export function subjectProgress(history: History, questions: Question[], subjectId: string): number {
  const qs = questions.filter(q => q.subjectId === subjectId);
  if (!qs.length) return 0;
  return qs.filter(q => history[q.id]).length / qs.length;
}

/** Accuracy over answered questions, optionally for one subject. Null when nothing answered yet. */
export function accuracy(history: History, questions: Question[], subjectId?: string): number | null {
  const answered = questions.filter(q => (!subjectId || q.subjectId === subjectId) && history[q.id]);
  if (!answered.length) return null;
  return Math.round((answered.filter(q => history[q.id].correct).length / answered.length) * 100);
}

/** Topics with the lowest accuracy among those attempted, worst first. */
export function weakTopics(history: History, questions: Question[], limit = 3) {
  const byTopic = new Map<string, { right: number; total: number; subjectId: string }>();
  for (const q of questions) {
    const h = history[q.id];
    if (!h) continue;
    const t = byTopic.get(q.topicId) ?? { right: 0, total: 0, subjectId: q.subjectId };
    t.total++; if (h.correct) t.right++;
    byTopic.set(q.topicId, t);
  }
  return [...byTopic.entries()]
    .map(([topicId, t]) => ({ topicId, subjectId: t.subjectId, accuracy: Math.round((t.right / t.total) * 100) }))
    .filter(t => t.accuracy < 100)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}
