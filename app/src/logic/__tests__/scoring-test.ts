import { mockScore, percent, practiceSummary } from '../scoring';

describe('percent', () => {
  it('gives a whole-number percentage', () => {
    expect(percent(15, 20)).toBe(75);
    expect(percent(20, 20)).toBe(100);
    expect(percent(1, 3)).toBe(33);
    expect(percent(2, 3)).toBe(67);
  });
  it('handles empty and out-of-range input', () => {
    expect(percent(0, 0)).toBe(0);
    expect(percent(-2, 10)).toBe(0);
    expect(percent(12, 10)).toBe(100);
  });
});

describe('mockScore', () => {
  it('scores each subject and the whole test as a percentage', () => {
    const r = mockScore([
      { subjectId: 'english', correct: 15, total: 20 },
      { subjectId: 'physics', correct: 12, total: 20 },
      { subjectId: 'chemistry', correct: 14, total: 20 },
      { subjectId: 'biology', correct: 13, total: 20 },
    ]);
    expect(r.perSubject.map(s => s.score)).toEqual([75, 60, 70, 65]);
    expect(r.total).toBe(68); // 54 of 80
    expect(r.max).toBe(100);
  });
  it('weights the overall score by question count', () => {
    const r = mockScore([
      { subjectId: 'english', correct: 10, total: 10 },
      { subjectId: 'physics', correct: 0, total: 30 },
    ]);
    expect(r.total).toBe(25);
  });
});

describe('practiceSummary', () => {
  it('counts correct answers and accuracy', () => {
    expect(practiceSummary([true, true, false, true, false, true, true, true, false, true])).toEqual({ correct: 7, total: 10, accuracy: 70 });
  });
  it('is zero for an empty session', () => {
    expect(practiceSummary([])).toEqual({ correct: 0, total: 0, accuracy: 0 });
  });
});
