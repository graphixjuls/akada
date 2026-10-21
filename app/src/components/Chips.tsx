import { Pressable, View } from 'react-native';
import { TranslateIcon, AtomIcon, UsersThreeIcon, PaletteIcon } from 'phosphor-react-native';
import { radius, space, subjectColors, useTheme, type SubjectColorKey } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';

/** Filter / choice chip, 48 tall (touch target). Selected = ink fill. */
export function Chip({ label, selected, onPress, grow }: { label: string; selected?: boolean; onPress?: () => void; grow?: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({ minHeight: 48, paddingHorizontal: space[16], borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? c.bgInverse : c.bgSurface, borderWidth: 1, borderColor: selected ? c.bgInverse : c.borderDefault, opacity: pressed ? 0.85 : 1, flexGrow: grow ? 1 : 0 })}
    >
      <AkadaText variant="labelMedium" style={{ color: selected ? c.textInverse : c.textSecondary }}>{label}</AkadaText>
    </Pressable>
  );
}

const TAG_ICON = { science: AtomIcon, social: UsersThreeIcon, arts: PaletteIcon, english: TranslateIcon } as const;

/** Small pill label in the subject's colour pair. */
export function SubjectTag({ label, color }: { label: string; color: SubjectColorKey }) {
  const { c } = useTheme();
  const sc = subjectColors(c, color);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4], alignSelf: 'flex-start', backgroundColor: sc.container, borderRadius: radius.full, paddingHorizontal: space[8], paddingVertical: space[4] }}>
      <AkadaIcon icon={TAG_ICON[color]} size={16} color={sc.strong} />
      <AkadaText variant="labelSmall" style={{ color: sc.strong }}>{label}</AkadaText>
    </View>
  );
}

/** Horizontal wrap of chips / tags. */
export function Wrap({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>{children}</View>;
}
