import type { Icon } from 'phosphor-react-native';
import { icon as iconSize, useTheme } from '../theme/theme';

interface Props {
  icon: Icon;
  /** Active/selected states use Phosphor Fill; everything else is Duotone. */
  active?: boolean;
  size?: number;
  /** Line colour. Defaults to text/primary; the tone uses the same colour unless toneColor is set. */
  color?: string;
  toneColor?: string;
}

/** Phosphor icon in the Akada style: Duotone line text/primary, tone primary/default at 25%. */
export function AkadaIcon({ icon: I, active, size = iconSize.default, color, toneColor }: Props) {
  const { c } = useTheme();
  const line = color ?? c.textPrimary;
  return active
    ? <I weight="fill" size={size} color={color ?? c.primary} />
    : <I weight="duotone" size={size} color={line} duotoneColor={toneColor ?? (color ?? c.primary)} duotoneOpacity={iconSize.toneOpacity} />;
}
