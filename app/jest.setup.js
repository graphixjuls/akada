// The native audio module isn't available under Jest; sounds are a no-op in tests.
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ volume: 1, play: () => {}, seekTo: () => Promise.resolve(), remove: () => {} }),
  setAudioModeAsync: () => Promise.resolve(),
}));
