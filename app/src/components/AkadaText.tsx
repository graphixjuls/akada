import { Text, type TextProps } from 'react-native';
import { type, useTheme, type AkadaColors } from '../theme/theme';

export type TextVariant = keyof typeof type;

interface Props extends TextProps {
  variant?: TextVariant;
  color?: keyof AkadaColors;
  align?: 'left' | 'center' | 'right';
}

/** Text with an Akada text style. Colour is always a semantic token. */
export function AkadaText({ variant = 'bodyMedium', color = 'textPrimary', align, style, ...rest }: Props) {
  const { c } = useTheme();
  return <Text {...rest} style={[type[variant], { color: c[color], textAlign: align }, style]} maxFontSizeMultiplier={1.6} />;
}
