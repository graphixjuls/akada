import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { DepartmentId } from '../data/types';
import type { ExamState } from '../logic/exam';
import { migrate } from './migrate';

const STORAGE_KEY = 'akada:v1';

export type ThemeSetting = 'system' | 'light' | 'dark';

export interface Profile {
  name: string;
  department: DepartmentId;
  courseId: string | null;
  /** Every subject the student studies, in their order. Any number, none compulsory. */
  subjects: string[];
  examDate: string;
  dailyGoalMin: number;
}

export interface AppData {
  /** 2: subjects are open (English is no longer added automatically). */
  schema?: number;
  profile: Profile | null;
  /** Onboarding answers collected before the profile is complete. */
  draft: Partial<Profile>;
  /** questionId → last practice result */
  history: Record<string, { correct: boolean; at: number }>;
  /** Local dates (YYYY-MM-DD) with at least one practice session. */
  practiceDays: string[];
  today: { date: string; minutes: number };
  sessions: number;
  bookmarks: string[];
  mocks: { at: number; total: number }[];
  activeExam: ExamState | null;
  /** installHintDismissed: the web "add to home screen" tip was closed. */
  settings: { theme: ThemeSetting; installHintDismissed?: boolean };
}

export const initialData: AppData = {
  schema: 2,
  profile: null,
  draft: {},
  history: {},
  practiceDays: [],
  today: { date: '', minutes: 0 },
  sessions: 0,
  bookmarks: [],
  mocks: [],
  activeExam: null,
  settings: { theme: 'system' },
};

export const localDate = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Fills any onboarding answer the student skipped. Everything is stored on the phone only. */
export const DEFAULT_PROFILE: Profile = {
  name: 'Friend', department: 'science', courseId: null,
  subjects: ['english', 'mathematics', 'physics', 'chemistry', 'biology'], examDate: 'Thu, 15 Apr 2027', dailyGoalMin: 30,
};

interface Store {
  data: AppData;
  hydrated: boolean;
  update: (fn: (d: AppData) => AppData) => void;
  updateDraft: (patch: Partial<Profile>) => void;
  completeOnboarding: () => void;
  /** Clears the profile and all progress on this phone. */
  resetAll: () => void;
  recordPractice: (results: { questionId: string; correct: boolean }[], minutes: number) => void;
  toggleBookmark: (questionId: string) => void;
  setExam: (exam: ExamState | null) => void;
  finishExam: (total: number) => void;
  setTheme: (theme: ThemeSetting) => void;
}

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => { if (raw) setData(migrate({ ...initialData, schema: 1, ...JSON.parse(raw) })); })
      .catch(() => { /* corrupted or unavailable storage: start fresh */ })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {}); }, 300);
  }, [data, hydrated]);

  const update = useCallback((fn: (d: AppData) => AppData) => setData(fn), []);

  const store = useMemo<Store>(() => ({
    data,
    hydrated,
    update,
    updateDraft: patch => update(d => ({ ...d, draft: { ...d.draft, ...patch } })),
    completeOnboarding: () => update(d => ({ ...d, profile: { ...DEFAULT_PROFILE, ...d.draft } as Profile, draft: {} })),
    resetAll: () => update(d => ({ ...initialData, settings: d.settings })),
    recordPractice: (results, minutes) => update(d => {
      const now = Date.now();
      const date = localDate(now);
      const history = { ...d.history };
      for (const r of results) history[r.questionId] = { correct: r.correct, at: now };
      const today = d.today.date === date ? { date, minutes: d.today.minutes + minutes } : { date, minutes };
      const practiceDays = d.practiceDays.includes(date) ? d.practiceDays : [...d.practiceDays, date];
      return { ...d, history, today, practiceDays, sessions: d.sessions + 1 };
    }),
    toggleBookmark: id => update(d => ({ ...d, bookmarks: d.bookmarks.includes(id) ? d.bookmarks.filter(b => b !== id) : [...d.bookmarks, id] })),
    setExam: exam => update(d => ({ ...d, activeExam: exam })),
    finishExam: total => update(d => ({ ...d, mocks: [...d.mocks, { at: Date.now(), total }] })),
    setTheme: theme => update(d => ({ ...d, settings: { ...d.settings, theme } })),
  }), [data, hydrated, update]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside AppStoreProvider');
  return s;
}
