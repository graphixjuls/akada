import { useColorScheme } from 'react-native';
import { useStore } from '../store/AppStore';
import { colors, type AkadaColors } from './tokens';

export * from './tokens';

/** Current colours. Follows the phone unless the student picked Light or Dark in Settings. */
export function useTheme(): { c: AkadaColors; scheme: 'light' | 'dark' } {
  const system = useColorScheme();
  const { data } = useStore();
  const setting = data.settings.theme;
  const scheme = setting === 'system' ? (system === 'dark' ? 'dark' : 'light') : setting;
  return { c: colors[scheme], scheme };
}

export type SubjectColorKey = 'science' | 'social' | 'arts' | 'english';

/** Strong + container colour pair for a subject family. */
export function subjectColors(c: AkadaColors, key: SubjectColorKey) {
  switch (key) {
    case 'science': return { strong: c.subjectScience, container: c.subjectScienceContainer };
    case 'social': return { strong: c.subjectSocial, container: c.subjectSocialContainer };
    case 'arts': return { strong: c.subjectArts, container: c.subjectArtsContainer };
    case 'english': return { strong: c.subjectEnglish, container: c.subjectEnglishContainer };
  }
}
