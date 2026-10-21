// Builds src/data/questions.json from the plain-text sources in content/questions/ (subfolders included).
//
// Source format (blank lines between blocks):
//   @subject mathematics
//   @topic mth-indices | Indices | SS1    <- declares a topic (once, anywhere)
//   @topic mth-indices                    <- adds more questions to a topic declared elsewhere
//   Q: Simplify 2³ × 2⁴.
//   A: 2⁷                 <- the correct answer
//   W: 2¹²                <- three wrong answers
//   W: 4⁷
//   W: 4¹²
//   E: When multiplying powers of the same base, add the indices: 3 + 4 = 7.
//
// A question's id comes from its topic and its wording, so adding or reordering questions never changes
// the ids of the others. The answer position and the order of the wrong options come from the id too,
// so every build gives the same result.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const srcDir = join(root, 'content', 'questions');
const outFile = join(root, 'src', 'data', 'questions.json');
const LEVELS = ['SS1', 'SS2', 'SS3'];

function hash(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  // Final avalanche so the low bits (used for the answer position) are well mixed.
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}

// mulberry32: small, well-mixed seeded PRNG.
function seededShuffle(items, seed) {
  const a = [...items];
  let t = seed;
  const rand = () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function listFiles(dir) {
  return readdirSync(dir).sort().flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : name.endsWith('.txt') ? [path] : [];
  });
}

const topics = new Map();
const raw = [];
const errors = [];

for (const path of listFiles(srcDir)) {
  const file = relative(srcDir, path).replaceAll('\\', '/');
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  let subjectId = null;
  let topicId = null;
  let q = null;

  const flush = (line) => {
    if (!q) return;
    const where = `${file}:${line}`;
    if (!topicId) errors.push(`${where} question before any @topic`);
    else if (!q.text || !q.answer || q.wrong.length !== 3 || !q.explanation) errors.push(`${where} needs Q, A, three W and E (got ${q.wrong.length} W)`);
    else if (new Set([q.answer, ...q.wrong]).size !== 4) errors.push(`${where} options are not all different`);
    else raw.push({ ...q, subjectId, topicId, where });
    q = null;
  };

  lines.forEach((text, i) => {
    const line = text.trim();
    const n = i + 1;
    if (!line || line.startsWith('#')) { if (!line) flush(n); return; }
    if (line.startsWith('@subject ')) { flush(n); subjectId = line.slice(9).trim(); return; }
    if (line.startsWith('@topic ')) {
      flush(n);
      const [id, name, level] = line.slice(7).split('|').map(s => s.trim());
      if (!subjectId) errors.push(`${file}:${n} @topic before @subject`);
      topicId = id;
      if (name === undefined) return; // reopening a topic declared elsewhere
      if (!LEVELS.includes(level)) errors.push(`${file}:${n} level must be one of ${LEVELS.join(', ')}`);
      if (topics.has(id)) errors.push(`${file}:${n} topic ${id} is declared twice`);
      topics.set(id, { id, subjectId, name, level });
      return;
    }
    const m = line.match(/^([QAWE]):\s*(.*)$/);
    if (!m) { errors.push(`${file}:${n} unrecognised line: ${line.slice(0, 60)}`); return; }
    const [, key, value] = m;
    if (key === 'Q') { flush(n); q = { text: value, answer: '', wrong: [], explanation: '' }; return; }
    if (!q) { errors.push(`${file}:${n} ${key}: without a Q:`); return; }
    if (key === 'A') q.answer = value;
    else if (key === 'W') q.wrong.push(value);
    else q.explanation = value;
  });
  flush(lines.length);
}

const questions = [];
const ids = new Map();
const seen = new Map();
for (const r of raw) {
  const topic = topics.get(r.topicId);
  if (!topic) { errors.push(`${r.where} topic ${r.topicId} is never declared`); continue; }
  if (topic.subjectId !== r.subjectId) errors.push(`${r.where} topic ${r.topicId} belongs to ${topic.subjectId}, not ${r.subjectId}`);
  // Shared stems such as "Choose the correctly spelt word." are fine; the same stem with the same answer is a repeat.
  const key = `${r.subjectId}:${r.text.toLowerCase()}:${r.answer.toLowerCase()}`;
  if (seen.has(key)) { errors.push(`${r.where} repeats ${seen.get(key)}`); continue; }
  seen.set(key, r.where);
  const id = `${r.topicId}-${hash(`${r.text}|${r.answer}`).toString(36).padStart(7, '0')}`;
  if (ids.has(id)) { errors.push(`${r.where} id clash with ${ids.get(id)}`); continue; }
  ids.set(id, r.where);
  const options = seededShuffle(r.wrong, hash(id));
  options.splice(hash(`${id}#answer`) % 4, 0, r.answer);
  questions.push({ id, subjectId: r.subjectId, topicId: r.topicId, text: r.text, options, answerIndex: options.indexOf(r.answer), explanation: r.explanation });
}
for (const t of topics.values()) if (!questions.some(q => q.topicId === t.id)) errors.push(`topic ${t.id} has no questions`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

// Topics in class order (SS1, SS2, SS3), keeping the order they were declared within a class.
const topicList = [...topics.values()].map((t, i) => ({ t, i })).sort((a, b) => LEVELS.indexOf(a.t.level) - LEVELS.indexOf(b.t.level) || a.i - b.i).map(x => x.t);
const bank = {
  notice: 'Original practice questions written for Akada. They are not past exam questions from any examination body.',
  topics: topicList,
  questions,
};
writeFileSync(outFile, JSON.stringify(bank) + '\n');

const bySubject = {};
for (const q of questions) bySubject[q.subjectId] = (bySubject[q.subjectId] ?? 0) + 1;
const positions = [0, 0, 0, 0];
for (const q of questions) positions[q.answerIndex]++;
console.log(`${questions.length} questions, ${topicList.length} topics`);
console.log(Object.entries(bySubject).sort().map(([s, n]) => `  ${s}: ${n} questions, ${topicList.filter(t => t.subjectId === s).length} topics`).join('\n'));
console.log(`answer positions A-D: ${positions.join(' / ')}`);
