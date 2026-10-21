import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Image, type ImageSourcePropType, Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space, useTheme, type AkadaColors } from '../theme/theme';

interface ScreenProps {
  children: ReactNode;
  /** Pinned to the bottom (main action). Content scrolls above it. */
  footer?: ReactNode;
  scroll?: boolean;
  /** Override the canvas (Splash uses primary). */
  background?: keyof AkadaColors;
  /** Tab screens: the Bottom Nav handles the bottom inset. */
  tab?: boolean;
  gap?: number;
}

/** 20 px side margins, 24 px between sections, safe-area aware, follows the theme. */
export function Screen({ children, footer, scroll = true, background = 'bgCanvas', tab, gap = space[24] }: ScreenProps) {
  const { c, scheme } = useTheme();
  const bg = c[background];
  const body = <View style={{ gap }}>{children}</View>;
  return (
    <SafeAreaView edges={tab ? ['top'] : ['top', 'bottom']} style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar style={background === 'primary' ? 'light' : scheme === 'dark' ? 'light' : 'dark'} />
      {scroll
        ? <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{body}</ScrollView>
        : <View style={[styles.content, { flex: 1 }]}>{body}</View>}
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
}

/** White card on the canvas: bg/surface, 1 px border/default, 16 radius, 16 padding. */
export function Card({ children, style, tone, onPress, gap = space[12] }: { children: ReactNode; style?: ViewStyle; tone?: keyof AkadaColors; onPress?: () => void; gap?: number }) {
  const { c } = useTheme();
  const filled = tone && tone !== 'bgSurface';
  const s: ViewStyle = { backgroundColor: c[tone ?? 'bgSurface'], borderColor: filled ? 'transparent' : c.borderDefault, borderWidth: 1, borderRadius: radius.lg, padding: space[16], gap };
  if (onPress) return <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s, style, pressed && { opacity: 0.85 }]}>{children}</Pressable>;
  return <View style={[s, style]}>{children}</View>;
}

/** Card with no padding, for stacks of List Rows. */
export function ListCard({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  return <View style={{ backgroundColor: c.bgSurface, borderColor: c.borderDefault, borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' }}>{children}</View>;
}

export function Photo({ source, height, rounded = 'xl' }: { source: ImageSourcePropType; height: number; rounded?: keyof typeof radius }) {
  const { c } = useTheme();
  return <Image source={source} style={{ width: '100%', height, borderRadius: radius[rounded], backgroundColor: c.bgSunken }} resizeMode="cover" accessible={false} />;
}

export function Row({ children, gap = space[12], align = 'center', style }: { children: ReactNode; gap?: number; align?: ViewStyle['alignItems']; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: align, gap }, style]}>{children}</View>;
}

export function Stack({ children, gap = space[8], style }: { children: ReactNode; gap?: number; style?: ViewStyle }) {
  return <View style={[{ gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space[20], paddingTop: space[16], paddingBottom: space[24] },
  footer: { paddingHorizontal: space[20], paddingTop: space[12], paddingBottom: space[16], gap: space[12] },
});
