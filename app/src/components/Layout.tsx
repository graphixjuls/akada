import { StatusBar } from 'expo-status-bar';
import { Children, type ReactNode } from 'react';
import { Image, type ImageSourcePropType, Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayout, type LayoutSize } from '../theme/responsive';
import { radius, space, useTheme, type AkadaColors } from '../theme/theme';

/** Content width on tablets and computers. Phones always use the full width with 20 px margins. */
const MAX_WIDTH = { page: 1080, focus: 720, form: 440 } as const;
export type ScreenWidth = keyof typeof MAX_WIDTH;

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
  /** Wide screens: page (dashboards, 1080), focus (one task, 720) or form (onboarding, 440). */
  width?: ScreenWidth;
  /** Desktop only: a full-height photo beside the content (onboarding split screen). */
  aside?: ImageSourcePropType;
}

const sidePadding = (size: LayoutSize) => (size === 'desktop' ? space[48] : size === 'tablet' ? space[32] : space[20]);

/** 20 px side margins on phones, centred max-width content on wider screens, safe-area aware, follows the theme. */
export function Screen({ children, footer, scroll = true, background = 'bgCanvas', tab, gap = space[24], width = 'page', aside }: ScreenProps) {
  const { c, scheme } = useTheme();
  const { size, wide } = useLayout();
  const bg = c[background];
  const split = !!aside && size === 'desktop';
  const max = wide ? (split ? MAX_WIDTH.form : MAX_WIDTH[width]) : undefined;
  const pad = sidePadding(size);
  // Centred column on wide screens; the whole width on phones.
  const column: ViewStyle = max ? { width: '100%', maxWidth: max, alignSelf: 'center' } : {};
  const body = <View style={[{ gap }, column]}>{children}</View>;
  const contentStyle: ViewStyle = { paddingHorizontal: pad, paddingTop: wide ? space[40] : space[16], paddingBottom: wide ? space[40] : space[24], ...(split ? { flexGrow: 1, justifyContent: 'center' } : null) };
  const content = (
    <>
      {scroll
        ? <ScrollView contentContainerStyle={contentStyle} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{body}</ScrollView>
        : <View style={[contentStyle, { flex: 1 }]}>{body}</View>}
      {footer && <View style={[styles.footer, { paddingHorizontal: pad }]}><View style={[{ gap: space[12] }, column]}>{footer}</View></View>}
    </>
  );
  return (
    <SafeAreaView edges={tab && !wide ? ['top'] : ['top', 'bottom']} style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar style={background === 'primary' ? 'light' : scheme === 'dark' ? 'light' : 'dark'} />
      {split ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image source={aside} style={{ flex: 1, height: '100%', backgroundColor: c.bgSunken }} resizeMode="cover" accessible={false} />
          <View style={{ flex: 1 }}>{content}</View>
        </View>
      ) : content}
    </SafeAreaView>
  );
}

/**
 * Main column plus a side column (360 px) on desktop; stacked on phones and tablets.
 * The side column comes after the main one, which is also its order when stacked.
 */
export function Columns({ main, side, sideWidth = 360, gap = space[24] }: { main: ReactNode; side: ReactNode; sideWidth?: number; gap?: number }) {
  const { desktop } = useLayout();
  if (!desktop) return <View style={{ gap }}>{main}{side}</View>;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap }}>
      <View style={{ flex: 1, gap }}>{main}</View>
      <View style={{ width: sideWidth, gap }}>{side}</View>
    </View>
  );
}

/** Equal-width grid: `columns` items per row (keep it small), gaps of 16. Empty cells keep the last row aligned. */
export function Grid({ children, columns, gap = space[16] }: { children: ReactNode; columns: number; gap?: number }) {
  const items = Children.toArray(children);
  const rows: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
  return (
    <View style={{ gap }}>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'stretch', gap }}>
          {r.map((item, j) => <View key={j} style={{ flex: 1 }}>{item}</View>)}
          {Array.from({ length: columns - r.length }, (_, j) => <View key={`gap-${j}`} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
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
  footer: { paddingHorizontal: space[20], paddingTop: space[12], paddingBottom: space[16], gap: space[12] },
});
