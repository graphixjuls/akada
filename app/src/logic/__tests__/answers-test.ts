import { bank, buildMock } from '../../data/bank';
import { createExam, examCounts, examReducer, gradeExam, numberState } from '../exam';
import { initialPractice, optionState, practiceReducer } from '../practice';

describe('practice answer state', () => {
  it('only checks once an answer is selected', () => {
    const s = practiceReducer(initialPractice, { type: 'check', answerIndex: 1 });
    expect(s.checked).toBe(false);
  });
  it('records a correct answer and shows Correct', () => {
    let s = practiceReducer(initialPractice, { type: 'select', option: 1 });
    expect(optionState(s, 1, 1)).toBe('Selected');
    s = practiceReducer(s, { type: 'check', answerIndex: 1 });
    expect(s.outcomes).toEqual([true]);
    expect(optionState(s, 1, 1)).toBe('Correct');
  });
  it('shows Wrong on the chosen option and Correct on the right one', () => {
    let s = practiceReducer(initialPractice, { type: 'select', option: 2 });
    s = practiceReducer(s, { type: 'check', answerIndex: 1 });
    expect(s.outcomes).toEqual([false]);
    expect(optionState(s, 2, 1)).toBe('Wrong');
    expect(optionState(s, 1, 1)).toBe('Correct');
    expect(optionState(s, 0, 1)).toBe('Default');
  });
  it('locks the answer after checking, then resets for the next question', () => {
    let s = practiceReducer(initialPractice, { type: 'select', option: 0 });
    s = practiceReducer(s, { type: 'check', answerIndex: 0 });
    s = practiceReducer(s, { type: 'select', option: 3 });
    expect(s.selected).toBe(0);
    s = practiceReducer(s, { type: 'next' });
    expect(s).toEqual({ index: 1, selected: null, checked: false, outcomes: [true] });
  });
});

describe('mock exam answer state', () => {
  const ids = ['a', 'b', 'c', 'd'];
  const start = () => createExam(ids, 0, 60_000);

  it('selects, changes and counts answers', () => {
    let s = examReducer(start(), { type: 'select', questionId: 'a', option: 1 });
    s = examReducer(s, { type: 'select', questionId: 'a', option: 2 });
    s = examReducer(s, { type: 'select', questionId: 'c', option: 0 });
    expect(s.answers).toEqual({ a: 2, c: 0 });
    expect(examCounts(s)).toEqual({ answered: 2, flagged: 0, unanswered: 2, total: 4 });
  });
  it('toggles flags', () => {
    let s = examReducer(start(), { type: 'toggleFlag', questionId: 'b' });
    expect(examCounts(s).flagged).toBe(1);
    s = examReducer(s, { type: 'toggleFlag', questionId: 'b' });
    expect(examCounts(s).flagged).toBe(0);
  });
  it('keeps navigation inside the exam', () => {
    let s = examReducer(start(), { type: 'prev' });
    expect(s.current).toBe(0);
    s = examReducer(s, { type: 'goto', index: 99 });
    expect(s.current).toBe(3);
    s = examReducer(s, { type: 'next' });
    expect(s.current).toBe(3);
  });
  it('shows navigator states with Current taking priority', () => {
    let s = examReducer(start(), { type: 'select', questionId: 'b', option: 0 });
    s = examReducer(s, { type: 'toggleFlag', questionId: 'c' });
    expect(numberState(s, 0)).toBe('Current');
    expect(numberState(s, 1)).toBe('Answered');
    expect(numberState(s, 2)).toBe('Flagged');
    expect(numberState(s, 3)).toBe('Unanswered');
  });
  it('locks answers after submitting', () => {
    let s = examReducer(start(), { type: 'select', questionId: 'a', option: 1 });
    s = examReducer(s, { type: 'submit', at: 5 });
    s = examReducer(s, { type: 'select', questionId: 'a', option: 3 });
    expect(s.answers.a).toBe(1);
    expect(s.submittedAt).toBe(5);
  });
});

describe('grading a mock test', () => {
  it('builds English first and grades each subject as a percentage', () => {
    const ids = buildMock(['physics', 'chemistry', 'biology']);
    expect(bank.questions.find(q => q.id === ids[0])?.subjectId).toBe('english');
    let s = createExam(ids, 0, 1);
    // answer every English question correctly, nothing else
    for (const q of bank.questions.filter(q => q.subjectId === 'english')) s = examReducer(s, { type: 'select', questionId: q.id, option: q.answerIndex });
    const r = gradeExam(s, bank.questions, ['english', 'physics', 'chemistry', 'biology']);
    expect(r.perSubject[0].score).toBe(100);
    expect(r.perSubject.slice(1).every(x => x.score === 0)).toBe(true);
    expect(r.total).toBe(25);
    expect(r.max).toBe(100);
  });
});
