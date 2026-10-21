// GENERATED from design-tokens/react-native/tokens.ts by scripts/sync-tokens.mjs.
// Do not edit here: change design-tokens/ (and Figma), then run `npm run sync-tokens`.

// Akada design tokens for React Native (Expo).
// Fonts:  npx expo install @expo-google-fonts/plus-jakarta-sans @expo-google-fonts/inter expo-font
// Icons:  npx expo install phosphor-react-native react-native-svg
//         <House weight="duotone" size={icon.default} color={c.textPrimary} duotoneColor={c.primary} duotoneOpacity={icon.toneOpacity} />
//         Use weight="fill" for active/selected states (active tab, bookmarked, flagged).
// Emoji:  copy design-tokens/assets/emoji/ into assets/emoji/ and use <Image source={emoji.fire} style={{ width: 48, height: 48 }} />.
// Usage:  const c = useColorScheme() === 'dark' ? colors.dark : colors.light;

export const colors = {
  light: {
    bgCanvas: '#FFFFFF',
    bgSurface: '#FFFFFF',
    bgSunken: '#ECEFF3',
    bgInverse: '#14161B',
    bgScrim: 'rgba(11,13,18,0.5)',
    textPrimary: '#14161B',
    textSecondary: '#5B6270',
    textTertiary: '#7A808C',
    textDisabled: '#B4B9C2',
    textInverse: '#FFFFFF',
    textBrand: '#1570E6',
    textOnPrimary: '#FFFFFF',
    borderDefault: '#E3E6EB',
    borderStrong: '#C9CED6',
    borderFocus: '#1570E6',
    primary: '#1570E6',
    primaryPressed: '#0F5DC4',
    primaryContainer: '#E3EEFF',
    primaryOnContainer: '#0B3F8C',
    success: '#0F8A44',
    successContainer: '#E3F7EA',
    error: '#D92D30',
    errorContainer: '#FDE8E8',
    warning: '#A86400',
    warningContainer: '#FFF4DB',
    subjectScience: '#0B6B52',
    subjectScienceContainer: '#D5EEE6',
    subjectSocial: '#5B3CC4',
    subjectSocialContainer: '#E6DEFB',
    subjectArts: '#8A5A00',
    subjectArtsContainer: '#FCEBB6',
    subjectEnglish: '#0B5BC0',
    subjectEnglishContainer: '#DCEBFF',
  },
  dark: {
    bgCanvas: '#0E1014',
    bgSurface: '#171A20',
    bgSunken: '#23272F',
    bgInverse: '#F2F4F7',
    bgScrim: 'rgba(0,0,0,0.6)',
    textPrimary: '#F2F4F7',
    textSecondary: '#A9B0BC',
    textTertiary: '#80879A',
    textDisabled: '#4A505B',
    textInverse: '#14161B',
    textBrand: '#6AAEFF',
    textOnPrimary: '#0A1A33',
    borderDefault: '#2A2F38',
    borderStrong: '#3A404B',
    borderFocus: '#4D9BFF',
    primary: '#4D9BFF',
    primaryPressed: '#73B1FF',
    primaryContainer: '#13305A',
    primaryOnContainer: '#CFE2FF',
    success: '#3DD07F',
    successContainer: '#0F3020',
    error: '#FF6B6E',
    errorContainer: '#3A1416',
    warning: '#FFC145',
    warningContainer: '#3A2A08',
    subjectScience: '#4FD1AB',
    subjectScienceContainer: '#163A31',
    subjectSocial: '#A58BFF',
    subjectSocialContainer: '#2B2350',
    subjectArts: '#F2C14E',
    subjectArtsContainer: '#3D3110',
    subjectEnglish: '#6AAEFF',
    subjectEnglishContainer: '#13305A',
  },
} as const;

export type AkadaColors = { [K in keyof typeof colors.light]: string };

/** 4-pt scale. Screen margin = 20, card padding = 16, card gap = 12. */
export const space = { 0: 0, 4: 4, 8: 8, 12: 12, 16: 16, 20: 20, 24: 24, 32: 32, 40: 40, 48: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 } as const;

export const shadow = {
  card: { shadowColor: '#14161B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  floating: { shadowColor: '#14161B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
} as const;

const heading = { bold: 'PlusJakartaSans_700Bold', semibold: 'PlusJakartaSans_600SemiBold' };
const body = { regular: 'Inter_400Regular', medium: 'Inter_500Medium', semibold: 'Inter_600SemiBold' };

export const type = {
  display: { fontFamily: heading.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.32 },
  h1: { fontFamily: heading.bold, fontSize: 28, lineHeight: 36, letterSpacing: -0.28 },
  h2: { fontFamily: heading.semibold, fontSize: 20, lineHeight: 28, letterSpacing: -0.1 },
  h3: { fontFamily: heading.semibold, fontSize: 18, lineHeight: 24 },
  question: { fontFamily: body.medium, fontSize: 17, lineHeight: 26 },
  bodyLarge: { fontFamily: body.regular, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: body.regular, fontSize: 14, lineHeight: 20 },
  bodySmall: { fontFamily: body.regular, fontSize: 12, lineHeight: 16 },
  labelLarge: { fontFamily: body.semibold, fontSize: 16, lineHeight: 20 },
  labelMedium: { fontFamily: body.semibold, fontSize: 14, lineHeight: 18 },
  labelSmall: { fontFamily: body.medium, fontSize: 12, lineHeight: 16 },
  /** Exam timer — tabular digits so numbers don't jump. */
  timer: { fontFamily: body.semibold, fontSize: 16, lineHeight: 20, fontVariant: ['tabular-nums'] as const },
} as const;

export const grid = { designWidth: 390, columns: 4, margin: 20, gutter: 16 } as const;

export const icon = { dense: 16, inline: 20, default: 24, feature: 32, toneOpacity: 0.25 } as const;

/** Fluent 3D emoji. Paths assume the PNGs are copied to <project>/assets/emoji/. */
export const emoji = {
  science: require('../../assets/emoji/science.png'),
  microscope: require('../../assets/emoji/microscope.png'),
  social: require('../../assets/emoji/social.png'),
  balanceScale: require('../../assets/emoji/balance-scale.png'),
  arts: require('../../assets/emoji/arts.png'),
  performingArts: require('../../assets/emoji/performing-arts.png'),
  english: require('../../assets/emoji/english.png'),
  openBook: require('../../assets/emoji/open-book.png'),
  abacus: require('../../assets/emoji/abacus.png'),
  fire: require('../../assets/emoji/fire.png'),
  trophy: require('../../assets/emoji/trophy.png'),
  medal: require('../../assets/emoji/medal.png'),
  star: require('../../assets/emoji/star.png'),
  party: require('../../assets/emoji/party.png'),
  target: require('../../assets/emoji/target.png'),
  rocket: require('../../assets/emoji/rocket.png'),
  brain: require('../../assets/emoji/brain.png'),
  lightbulb: require('../../assets/emoji/lightbulb.png'),
  graduationCap: require('../../assets/emoji/graduation-cap.png'),
  alarmClock: require('../../assets/emoji/alarm-clock.png'),
  hourglass: require('../../assets/emoji/hourglass.png'),
  check: require('../../assets/emoji/check.png'),
  crown: require('../../assets/emoji/crown.png'),
  sparkles: require('../../assets/emoji/sparkles.png'),
  gem: require('../../assets/emoji/gem.png'),
  chart: require('../../assets/emoji/chart.png'),
  calendar: require('../../assets/emoji/calendar.png'),
  bell: require('../../assets/emoji/bell.png'),
  locked: require('../../assets/emoji/locked.png'),
  pencil: require('../../assets/emoji/pencil.png'),
  cool: require('../../assets/emoji/cool.png'),
  partying: require('../../assets/emoji/partying.png'),
  thinking: require('../../assets/emoji/thinking.png'),
  worried: require('../../assets/emoji/worried.png'),
  wave: require('../../assets/emoji/wave.png'),
  strong: require('../../assets/emoji/strong.png'),
} as const;
