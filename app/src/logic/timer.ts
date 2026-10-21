import { MOCK_FORMAT } from '../data/catalog';

export const WARNING_MS = 5 * 60_000;
export const CRITICAL_MS = 60_000;

export type TimerState = 'normal' | 'warning' | 'critical' | 'done';

/**
 * Time left is computed from the start timestamp, never from a ticking counter, so the
 * clock stays correct when the app is backgrounded or killed (it keeps running, like a
 * real timed exam).
 */
export function remainingMs(startedAt: number, durationMs: number, now: number): number {
  return Math.max(0, startedAt + durationMs - now);
}

export function timerState(ms: number): TimerState {
  if (ms <= 0) return 'done';
  if (ms < CRITICAL_MS) return 'critical';
  if (ms < WARNING_MS) return 'warning';
  return 'normal';
}

/** h:mm:ss, e.g. 1:24:59. Rounds up so the clock shows 0:00:00 only when time is truly up. */
export function formatClock(ms: number): string {
  const total = Math.ceil(Math.max(0, ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Mock tests allow a fixed time per question. */
export function mockDurationMs(questionCount: number): number {
  return questionCount * MOCK_FORMAT.secondsPerQuestion * 1000;
}
