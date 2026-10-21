import { Platform, useWindowDimensions } from 'react-native';

/** Phone < 768 ≤ tablet < 1200 ≤ desktop. Matches the Figma "Web build" page. */
export const BREAKPOINTS = { tablet: 768, desktop: 1200 } as const;

export type LayoutSize = 'phone' | 'tablet' | 'desktop';

export function layoutFor(width: number): LayoutSize {
  return width >= BREAKPOINTS.desktop ? 'desktop' : width >= BREAKPOINTS.tablet ? 'tablet' : 'phone';
}

/** Current layout size. `wide` = tablet or desktop (side navigation, multi-column pages). */
export function useLayout() {
  const { width } = useWindowDimensions();
  const size = layoutFor(width);
  return { size, wide: size !== 'phone', desktop: size === 'desktop', width };
}

/** Where progress is kept, in words: the app is used on phones, the website also on computers. */
export const THIS_DEVICE = Platform.OS === 'web' ? 'this device' : 'this phone';
