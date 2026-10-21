import { View } from 'react-native';
import { radius, space, useTheme } from '../theme/theme';

/** Linear progress: track bg/sunken, fill primary (or a subject colour). value is 0–1. */
export function ProgressBar({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const { c } = useTheme();
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: pct }} style={{ height, borderRadius: radius.full, backgroundColor: c.bgSunken, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height: '100%', borderRadius: radius.full, backgroundColor: color ?? c.primary }} />
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
