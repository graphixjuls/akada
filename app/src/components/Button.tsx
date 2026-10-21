import type { Icon } from 'phosphor-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius, space, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';

export type ButtonStyle = 'primary' | 'secondary' | 'tonal' | 'outline' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonStyle;
  size?: 'large' | 'small';
  disabled?: boolean;
  leadingIcon?: Icon;
  /** Stretch to the parent's width (most full-width actions). */
  block?: boolean;
}

/** Pill button. Use one Primary per screen. Large = 52 tall, Small = 40 (with a 48 hit area). */
export function Button({ label, onPress, variant = 'primary', size = 'large', disabled, leadingIcon, block }: Props) {
  const { c } = useTheme();
  const palette = {
    primary: { bg: c.primary, fg: c.textOnPrimary, border: 'transparent' },
    secondary: { bg: c.bgInverse, fg: c.textInverse, border: 'transparent' },
    tonal: { bg: c.primaryContainer, fg: c.primaryOnContainer, border: 'transparent' },
    outline: { bg: 'transparent', fg: c.textPrimary, border: c.borderStrong },
    ghost: { bg: 'transparent', fg: c.textBrand, border: 'transparent' },
  }[variant];
  const fg = disabled ? c.textDisabled : palette.fg;
  const bg = disabled && variant !== 'ghost' && variant !== 'outline' ? c.bgSunken : palette.bg;
  const height = size === 'large' ? 52 : 40;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      hitSlop={size === 'small' ? 4 : 0}
      style={({ pressed }) => [
        styles.base,
        { height, backgroundColor: bg, borderColor: disabled && variant === 'outline' ? c.borderDefault : palette.border, paddingHorizontal: size === 'large' ? space[24] : space[16], opacity: pressed ? 0.85 : 1 },
        block && styles.block,
      ]}
    >
      <View style={styles.row}>
        {leadingIcon && <AkadaIcon icon={leadingIcon} size={20} color={fg} />}
        <AkadaText variant={size === 'large' ? 'labelLarge' : 'labelMedium'} style={{ color: fg }}>{label}</AkadaText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.full, borderWidth: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  block: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[8] },
});
