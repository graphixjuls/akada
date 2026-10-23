import { Pressable, View } from 'react-native';
import { radius, space, subjectColors, useTheme, type SubjectColorKey } from '../theme/theme';
import { AkadaText } from './AkadaText';
import { Emoji, type EmojiName } from './Emoji';
import { ProgressBar } from './Progress';

/** Home 2-column grid card: pastel container, emoji, title, topics, progress. */
export function SubjectCard({ title, subtitle, color, emoji, progress, status, onPress }: { title: string; subtitle: string; color: SubjectColorKey; emoji: EmojiName; progress: number; status: string; onPress?: () => void }) {
  const { c } = useTheme();
  const sc = subjectColors(c, color);
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title}, ${status}`} style={({ pressed }) => ({ flex: 1, backgroundColor: sc.container, borderRadius: radius.lg, padding: space[16], gap: space[12], opacity: pressed ? 0.85 : 1 })}>
      <View style={{ width: 48, height: 48, borderRadius: radius.full, backgroundColor: c.bgSurface, alignItems: 'center', justifyContent: 'center' }}>
        <Emoji name={emoji} size={32} />
      </View>
      <View style={{ gap: space[4] }}>
        <AkadaText variant="h3" heading={false} numberOfLines={1}>{title}</AkadaText>
        <AkadaText variant="bodySmall" color="textSecondary" numberOfLines={2}>{subtitle}</AkadaText>
      </View>
      <ProgressBar value={progress} color={sc.strong} height={6} />
      <AkadaText variant="labelSmall" style={{ color: sc.strong }}>{status}</AkadaText>
    </Pressable>
  );
}
