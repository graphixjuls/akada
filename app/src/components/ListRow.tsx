import type { Icon } from 'phosphor-react-native';
import { CaretRightIcon, CheckCircleIcon } from '@/components/icons';
import { Image, type ImageSourcePropType, Pressable, View } from 'react-native';
import { radius, space, useTheme, type AkadaColors } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';

interface ListRowProps {
  label: string;
  value?: string;
  icon?: Icon;
  iconActive?: boolean;
  chevron?: boolean;
  onPress?: () => void;
  labelColor?: keyof AkadaColors;
  last?: boolean;
}

/** Settings / topics row, min 56 tall, bottom divider. Full row is the tap target. */
export function ListRow({ label, value, icon, iconActive, chevron = true, onPress, labelColor = 'textPrimary', last }: ListRowProps) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: space[12], paddingHorizontal: space[16], paddingVertical: space[12], backgroundColor: pressed ? c.bgSunken : c.bgSurface, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.borderDefault })}
    >
      {icon && <AkadaIcon icon={icon} active={iconActive} color={labelColor === 'error' ? c.error : undefined} />}
      <AkadaText variant="bodyLarge" color={labelColor} style={{ flex: 1 }}>{label}</AkadaText>
      {value && <AkadaText variant="bodyMedium" color="textSecondary">{value}</AkadaText>}
      {chevron && <AkadaIcon icon={CaretRightIcon} size={20} color={c.textTertiary} />}
    </Pressable>
  );
}

/** Onboarding department picker row: photo, title, description, radio. */
export function DepartmentCard({ title, description, image, selected, onPress }: { title: string; description: string; image: ImageSourcePropType; selected: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      aria-checked={selected}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space[16], padding: space[12], borderRadius: radius.lg, borderWidth: selected ? 2 : 1, borderColor: selected ? c.primary : c.borderDefault, backgroundColor: selected ? c.primaryContainer : c.bgSurface }}
    >
      <Image source={image} style={{ width: 80, height: 80, borderRadius: radius.md, backgroundColor: c.bgSunken }} accessible={false} />
      <View style={{ flex: 1, gap: space[4] }}>
        <AkadaText variant="h3" heading={false}>{title}</AkadaText>
        <AkadaText variant="bodySmall" color="textSecondary">{description}</AkadaText>
      </View>
      {selected
        ? <AkadaIcon icon={CheckCircleIcon} active />
        : <View style={{ width: 24, height: 24, borderRadius: radius.full, borderWidth: 2, borderColor: c.borderStrong }} />}
    </Pressable>
  );
}
