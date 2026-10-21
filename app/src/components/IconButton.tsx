import type { Icon } from 'phosphor-react-native';
import { Pressable } from 'react-native';
import { radius, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';

interface Props {
  icon: Icon;
  label: string;
  onPress?: () => void;
  variant?: 'filled' | 'tonal' | 'outline';
  active?: boolean;
}

/** 48 × 48 circle. Outline in headers (back, close, bell), Filled for a single strong action. */
export function IconButton({ icon, label, onPress, variant = 'outline', active }: Props) {
  const { c } = useTheme();
  const bg = variant === 'filled' ? c.primary : variant === 'tonal' ? c.primaryContainer : c.bgSurface;
  const fg = variant === 'filled' ? c.textOnPrimary : variant === 'tonal' ? c.primaryOnContainer : c.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({ width: 48, height: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: bg, borderWidth: variant === 'outline' ? 1 : 0, borderColor: c.borderDefault, opacity: pressed ? 0.8 : 1 })}
    >
      <AkadaIcon icon={icon} active={active} color={active ? c.primary : fg} />
    </Pressable>
  );
}
