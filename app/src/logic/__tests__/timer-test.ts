import { CRITICAL_MS, WARNING_MS, formatClock, mockDurationMs, remainingMs, timerState } from '../timer';

describe('remainingMs', () => {
  const start = 1_000_000;
  const twoHours = 2 * 60 * 60_000;
  it('counts down from the start timestamp', () => {
    expect(remainingMs(start, twoHours, start)).toBe(twoHours);
    expect(remainingMs(start, twoHours, start + 60_000)).toBe(twoHours - 60_000);
  });
  it('keeps running while the app is in the background (time is wall-clock based)', () => {
    const afterBackground = start + 45 * 60_000; // app was closed for 45 minutes
    expect(remainingMs(start, twoHours, afterBackground)).toBe(75 * 60_000);
  });
  it('never goes below zero', () => {
    expect(remainingMs(start, twoHours, start + twoHours + 5_000)).toBe(0);
  });
});

describe('timerState', () => {
  it('moves through normal, warning, critical and done', () => {
    expect(timerState(WARNING_MS + 1)).toBe('normal');
    expect(timerState(WARNING_MS - 1)).toBe('warning');
    expect(timerState(CRITICAL_MS - 1)).toBe('critical');
    expect(timerState(0)).toBe('done');
  });
});

describe('formatClock', () => {
  it('formats as h:mm:ss', () => {
    expect(formatClock((1 * 3600 + 24 * 60 + 59) * 1000)).toBe('1:24:59');
    expect(formatClock(58_000)).toBe('0:00:58');
    expect(formatClock(0)).toBe('0:00:00');
  });
  it('rounds partial seconds up', () => {
    expect(formatClock(500)).toBe('0:00:01');
  });
});

describe('mockDurationMs', () => {
  it('allows 45 seconds per question', () => {
    expect(mockDurationMs(80)).toBe(60 * 60_000);
    expect(mockDurationMs(20)).toBe(15 * 60_000);
  });
});
