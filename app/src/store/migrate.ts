import type { AppData } from './AppStore';

/** Before schema 2, English was compulsory and stored separately from the 3 chosen subjects. */
export function migrate(d: AppData): AppData {
  if ((d.schema ?? 1) >= 2) return d;
  const withEnglish = (s?: string[]) => (s ? ['english', ...s.filter(x => x !== 'english')] : s);
  return {
    ...d,
    schema: 2,
    profile: d.profile ? { ...d.profile, subjects: withEnglish(d.profile.subjects)! } : null,
    draft: { ...d.draft, subjects: withEnglish(d.draft.subjects) },
  };
}
