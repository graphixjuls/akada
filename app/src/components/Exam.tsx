import { CheckCircleIcon, TimerIcon, XCircleIcon } from '@/components/icons';
import { Pressable, View } from 'react-native';
import type { NumberState } from '../logic/exam';
import type { OptionState } from '../logic/practice';
import { formatClock, timerState } from '../logic/timer';
import { radius, space, type, useTheme } from '../theme/theme';
import { AkadaIcon } from './AkadaIcon';
import { AkadaText } from './AkadaText';

/** Letter A–D + answer text, full-row tap. Correct/Wrong always pair colour with an icon. */
export function AnswerOption({ letter, text, state, onPress, disabled }: { letter: string; text: string; state: OptionState; onPress?: () => void; disabled?: boolean }) {
  const { c } = useTheme();
  const look = {
    Default: { bg: c.bgSurface, border: c.borderDefault, badge: c.bgSunken, badgeText: c.textSecondary },
    Selected: { bg: c.primaryContainer, border: c.primary, badge: c.primary, badgeText: c.textOnPrimary },
    Correct: { bg: c.successContainer, border: c.success, badge: c.success, badgeText: c.textOnPrimary },
    Wrong: { bg: c.errorContainer, border: c.error, badge: c.error, badgeText: c.textOnPrimary },
  }[state];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected: state !== 'Default', disabled }}
      accessibilityLabel={`${letter}. ${text}${state === 'Correct' ? ', correct answer' : state === 'Wrong' ? ', wrong' : ''}`}
      style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: space[12], padding: space[12], borderRadius: radius.md, borderWidth: state === 'Default' ? 1 : 2, borderColor: look.border, backgroundColor: look.bg }}
    >
      <View style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: look.badge }}>
        <AkadaText variant="labelMedium" style={{ color: look.badgeText }}>{letter}</AkadaText>
      </View>
      <AkadaText variant="bodyLarge" style={{ flex: 1 }}>{text}</AkadaText>
      {state === 'Correct' && <AkadaIcon icon={CheckCircleIcon} color={c.success} />}
      {state === 'Wrong' && <AkadaIcon icon={XCircleIcon} color={c.error} />}
    </Pressable>
  );
}

/** Exam timer: Normal, Warning (< 5 min), Critical (< 1 min). Tabular figures. */
export function Timer({ ms }: { ms: number }) {
  const { c } = useTheme();
  const s = timerState(ms);
  const fg = s === 'normal' ? c.textPrimary : s === 'warning' ? c.warning : c.error;
  const bg = s === 'normal' ? c.bgSurface : s === 'warning' ? c.warningContainer : c.errorContainer;
  return (
    <View accessibilityRole="timer" accessibilityLabel={`Time left ${formatClock(ms)}`} style={{ flexDirection: 'row', alignItems: 'center', gap: space[8], height: 40, paddingHorizontal: space[12], borderRadius: radius.full, backgroundColor: bg, borderWidth: s === 'normal' ? 1 : 0, borderColor: c.borderDefault }}>
      <AkadaIcon icon={TimerIcon} size={20} color={fg} />
      <AkadaText style={[type.timer, { color: fg }]}>{formatClock(ms)}</AkadaText>
    </View>
  );
}

/** Question navigator cell, 44 × 44 (with a 48 hit area). */
export function QuestionNumber({ n, state, onPress }: { n: number; state: NumberState; onPress?: () => void }) {
  const { c } = useTheme();
  const look = {
    Unanswered: { bg: c.bgSurface, border: c.borderDefault, fg: c.textSecondary },
    Answered: { bg: c.primary, border: c.primary, fg: c.textOnPrimary },
    Current: { bg: c.primaryContainer, border: c.borderFocus, fg: c.primaryOnContainer },
    Flagged: { bg: c.warningContainer, border: c.warning, fg: c.warning },
  }[state];
  return (
    <Pressable onPress={onPress} hitSlop={2} accessibilityRole="button" accessibilityLabel={`Question ${n}, ${state.toLowerCase()}`} style={{ width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: look.bg, borderWidth: state === 'Current' ? 2 : 1, borderColor: look.border }}>
      <AkadaText variant="labelMedium" style={{ color: look.fg }}>{n}</AkadaText>
    </Pressable>
  );
}
