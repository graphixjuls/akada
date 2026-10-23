import { Text, type TextProps } from 'react-native';
import { type, useTheme, type AkadaColors } from '../theme/theme';

export type TextVariant = keyof typeof type;

interface Props extends TextProps {
  variant?: TextVariant;
  color?: keyof AkadaColors;
  align?: 'left' | 'center' | 'right';
  /** h1–h3 are headings for screen readers. Pass false for big numbers or titles inside a button. */
  heading?: boolean;
}

const LEVEL: Partial<Record<TextVariant, number>> = { h1: 1, h2: 2, h3: 3 };

/** Text with an Akada text style. Colour is always a semantic token. */
export function AkadaText({ variant = 'bodyMedium', color = 'textPrimary', align, style, heading, ...rest }: Props) {
  const { c } = useTheme();
  const level = heading === false ? undefined : LEVEL[variant];
  const a11y = level ? { role: 'heading' as const, 'aria-level': level } : {};
  return <Text {...a11y} {...rest} style={[type[variant], { color: c[color], textAlign: align }, style]} maxFontSizeMultiplier={1.6} />;
}
