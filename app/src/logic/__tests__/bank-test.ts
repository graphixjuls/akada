import { bank, buildMock, pickQuestions, questionsFor, shuffle } from '../../data/bank';
import { MOCK_FORMAT, subjects } from '../../data/catalog';

/** Small deterministic random source so the picks are repeatable. */
function seeded(seed: number) {
  let x = seed;
  return () => { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
}

describe('question bank', () => {
  it('has questions for every subject in the catalogue, enough for a mock test', () => {
    for (const s of subjects) expect(questionsFor(s.id).length).toBeGreaterThanOrEqual(MOCK_FORMAT.questionsPerSubject);
  });
  it('has well-formed questions', () => {
    const topicIds = new Set(bank.topics.map(t => t.id));
    const ids = new Set<string>();
    for (const q of bank.questions) {
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);
      expect(topicIds.has(q.topicId)).toBe(true);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect([0, 1, 2, 3]).toContain(q.answerIndex);
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });
  it('spreads correct answers across A to D', () => {
    const counts = [0, 0, 0, 0];
    for (const q of bank.questions) counts[q.answerIndex]++;
    for (const c of counts) expect(c / bank.questions.length).toBeGreaterThan(0.2);
  });
  it('gives every topic a class level', () => {
    for (const t of bank.topics) expect(['SS1', 'SS2', 'SS3']).toContain(t.level);
  });
  it('never mentions JAMB or UTME', () => {
    expect(JSON.stringify(bank)).not.toMatch(/\b(jamb|utme)\b/i); // whole words, so "enjambment" is fine
  });
});

describe('picking questions', () => {
  const pool = questionsFor('mathematics');
  it('shuffles without losing or repeating items', () => {
    const out = shuffle([1, 2, 3, 4, 5], seeded(1));
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });
  it('returns the requested number of different questions', () => {
    const picked = pickQuestions(pool, 10, undefined, seeded(2));
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map(q => q.id)).size).toBe(10);
  });
  it('spreads questions across topics', () => {
    const picked = pickQuestions(pool, 10, undefined, seeded(3));
    expect(new Set(picked.map(q => q.topicId)).size).toBe(10);
  });
  it('puts unanswered questions first within a topic', () => {
    const topic = pool.filter(q => q.topicId === pool[0].topicId);
    const answered = new Set(topic.slice(0, 3).map(q => q.id));
    const picked = pickQuestions(topic, 3, id => answered.has(id), seeded(4));
    expect(picked.every(q => !answered.has(q.id))).toBe(true);
  });
  it('returns everything when asked for more than the pool holds', () => {
    expect(pickQuestions(pool.slice(0, 4), 10, undefined, seeded(5))).toHaveLength(4);
  });
  it('builds a mock with a fixed number of questions per subject', () => {
    const ids = buildMock(['physics', 'chemistry', 'biology'], undefined, seeded(6));
    expect(ids).toHaveLength(3 * MOCK_FORMAT.questionsPerSubject);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
