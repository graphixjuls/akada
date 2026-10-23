import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { AkadaText } from './AkadaText';
import { useTheme } from '../theme/theme';

/**
 * The akada mark: taped glasses on a rounded tile (Figma: Brand page, "0 · Final brand").
 * 96-unit grid, the same geometry as scripts/make-icons.py.
 */
export function LogoMark({ size = 40, inverse }: { size?: number; inverse?: boolean }) {
  const { c } = useTheme();
  // `inverse`: white tile with blue glasses, for brand-blue backgrounds such as the splash.
  const tile = inverse ? c.textOnPrimary : c.primary;
  const glasses = inverse ? c.primary : c.textOnPrimary;
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Rect width={96} height={96} rx={24} fill={tile} />
      <Circle cx={31} cy={50} r={14} fill="none" stroke={glasses} strokeWidth={7} />
      <Circle cx={65} cy={50} r={14} fill="none" stroke={glasses} strokeWidth={7} />
      <Path d="M17 45 L10 40 M79 45 L86 40" stroke={glasses} strokeWidth={6} strokeLinecap="round" />
      <Rect x={42} y={42} width={12} height={15} rx={3} fill={glasses} />
      <Path d="M45 45 V54 M51 45 V54" stroke={tile} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** The wordmark is always lowercase, in Poppins SemiBold. */
export function Wordmark({ size = 24, onPrimary }: { size?: number; onPrimary?: boolean }) {
  return (
    <AkadaText variant="h2" heading={false} color={onPrimary ? 'textOnPrimary' : 'textPrimary'} style={{ fontFamily: 'Poppins_600SemiBold', fontSize: size, lineHeight: size * 1.3, letterSpacing: -0.01 * size }}>
      akada
    </AkadaText>
  );
}

/** Mark and wordmark side by side. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel="akada" style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.25 }}>
      <LogoMark size={size} />
      <Wordmark size={size * 0.62} />
    </View>
  );
}
