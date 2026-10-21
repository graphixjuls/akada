import AsyncStorage from '@react-native-async-storage/async-storage';
import { configure, fireEvent, screen } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { questionsFor } from '../data/bank';
import { initialData, localDate, type Profile } from '../store/AppStore';

// eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factories must use require
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const APP = './src/app';

// Rendering the real router loads every route module, which is slow on the first test.
jest.setTimeout(180_000);
configure({ asyncUtilTimeout: 10_000 });

const BONDING = questionsFor('chemistry', 'chm-bonding');
const PROFILE: Profile = { name: 'Chiamaka', department: 'science', courseId: 'medicine', subjects: ['physics', 'chemistry', 'biology'], examDate: 'Thu, 15 Apr 2027', dailyGoalMin: 30 };

async function seedReturning() {
  const now = Date.now();
  const data = {
    ...initialData,
    profile: PROFILE,
    sessions: 3,
    practiceDays: [localDate(now)],
    today: { date: localDate(now), minutes: 12 },
    history: { [BONDING[0].id]: { correct: true, at: now }, [BONDING[1].id]: { correct: false, at: now - 1000 }, [questionsFor('english')[0].id]: { correct: true, at: now - 2000 } },
    mocks: [{ at: now - 86_400_000, total: 62 }],
  };
  await AsyncStorage.setItem('akada:v1', JSON.stringify(data));
}

beforeEach(async () => { await AsyncStorage.clear(); });

describe('returning student', () => {
  beforeEach(seedReturning);

  it('goes straight to Home', async () => {
    await renderRouter(APP, { initialUrl: '/' });
    expect(await screen.findByText('Continue where you left off')).toBeTruthy();
    expect(screen.getByText('Chiamaka')).toBeTruthy();
  });

  it.each([
    ['/practice', 'Quick practice'],
    ['/mock', 'Mock test'],
    ['/practice/geography', 'SS3'],
    ['/practice', 'More subjects'],
    ['/progress', 'Accuracy by subject'],
    ['/profile', 'My subjects'],
    ['/practice/chemistry', 'Chemistry topics'],
    ['/practice/session?subject=chemistry&topic=chm-bonding', 'Check answer'],
    ['/settings', 'Theme'],
    ['/downloads', 'Offline access'],
    ['/bookmarks', 'No bookmarks yet'],
    ['/notifications', "You're all caught up"],
    [`/review?ids=${BONDING[0].id}`, 'Review answers'],
  ])('renders %s', async (url, text) => {
    await renderRouter(APP, { initialUrl: url });
    expect((await screen.findAllByText(text)).length).toBeGreaterThan(0);
  });

  it('gives instant feedback with an explanation in practice', async () => {
    await renderRouter(APP, { initialUrl: '/practice/session?subject=chemistry&topic=chm-bonding' });
    await screen.findByText('Check answer');
    // Questions are shuffled, so find whichever one is showing and pick its correct option.
    const q = questionsFor('chemistry', 'chm-bonding').find(x => screen.queryByText(x.text))!;
    await fireEvent.press(screen.getByLabelText(`${'ABCD'[q.answerIndex]}. ${q.options[q.answerIndex]}`));
    await fireEvent.press(screen.getByRole('button', { name: 'Check answer' }));
    expect(await screen.findByText('Correct! Well done.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next question' })).toBeTruthy();
  });

  it('starts a mock test with a running timer', async () => {
    await renderRouter(APP, { initialUrl: '/mock' });
    await fireEvent.press(await screen.findByText('Start test'));
    expect(await screen.findByLabelText(/^Time left \d:\d\d:\d\d/)).toBeTruthy();
    expect(screen).toHavePathname('/exam');
    await fireEvent.press(screen.getByText('Submit'));
    expect(await screen.findByText('Submit your test?')).toBeTruthy();
  });
});
