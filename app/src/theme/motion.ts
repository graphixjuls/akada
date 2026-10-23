import { useEffect, useState } from 'react';
import { AccessibilityInfo, Easing, Platform } from 'react-native';

/** Motion tokens. Keep motion short and small: it should confirm an action, never delay it. */
export const duration = { fast: 150, base: 250, slow: 400 } as const;
export const easing = { out: Easing.out(Easing.cubic), inOut: Easing.inOut(Easing.cubic) } as const;

/** The native driver is not available on the web. */
export const nativeDriver = Platform.OS !== 'web';

/** True when the student has asked the device to reduce motion. Animations are skipped then. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => Platform.OS === 'web' && typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const on = (e: MediaQueryListEvent) => setReduced(e.matches);
      mq.addEventListener?.('change', on);
      return () => mq.removeEventListener?.('change', on);
    }
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then(v => { if (alive) setReduced(v); }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => { alive = false; sub.remove(); };
  }, []);
  return reduced;
}
