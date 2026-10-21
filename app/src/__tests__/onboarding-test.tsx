import AsyncStorage from '@react-native-async-storage/async-storage';
import { configure, fireEvent, screen } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';

// eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factories must use require
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const APP = './src/app';

// Rendering the real router loads every route module, which is slow on the first test.
jest.setTimeout(180_000);
configure({ asyncUtilTimeout: 10_000 });


beforeEach(async () => { await AsyncStorage.clear(); });

describe('new student', () => {
  it('starts at the Splash', async () => {
    await renderRouter(APP, { initialUrl: '/' });
    expect(await screen.findByText('Exam practice that fits your day')).toBeTruthy();
    expect(screen).toHavePathname('/splash');
  });

  it.each([
    ['/welcome', 'Practise every subject'],
    ['/get-started', 'Let’s get you started'],
    ['/setup/department', "What's your department?"],
    ['/setup/course', 'What do you want to study?'],
    ['/setup/subjects', 'Your subjects'],
    ['/setup/exam', 'When is your exam?'],
    ['/setup/done', 'Start practising'],
  ])('renders %s', async (url, text) => {
    await renderRouter(APP, { initialUrl: url });
    expect(await screen.findByText(text)).toBeTruthy();
  });

  it('only needs a first name, with no account or phone number', async () => {
    await renderRouter(APP, { initialUrl: '/get-started' });
    expect(screen.queryByLabelText('Phone number')).toBeNull();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await fireEvent.changeText(await screen.findByLabelText('First name'), 'Tunde');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    expect(screen).toHavePathname('/setup/department');
  });
});
