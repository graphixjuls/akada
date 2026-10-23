import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { duration, easing, useReducedMotion } from '../theme/motion';
import { radius, space, useTheme } from '../theme/theme';

/** Linear progress: track bg/sunken, fill primary (or a subject colour). value is 0–1. The fill eases to each new value. */
export function ProgressBar({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const { c } = useTheme();
  const reduced = useReducedMotion();
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  const [fill] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) { fill.setValue(pct); return; }
    // Width can't use the native driver; the bar is tiny, so the JS thread copes easily.
    Animated.timing(fill, { toValue: pct, duration: duration.slow, easing: easing.out, useNativeDriver: false }).start();
  }, [pct, reduced, fill]);
  const width = fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View accessibilityRole="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} style={{ height, borderRadius: radius.full, backgroundColor: c.bgSunken, overflow: 'hidden' }}>
      <Animated.View style={{ width, height: '100%', borderRadius: radius.full, backgroundColor: color ?? c.primary }} />
    </View>
  );
}

/** Welcome-slide step indicator. Decorative; the slide content itself changes. */
export function PageDots({ count, active }: { count: number; active: number }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: space[8], alignSelf: 'center' }} accessible={false}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: radius.full, backgroundColor: i === active ? c.primary : c.borderStrong }} />
      ))}
    </View>
  );
}
