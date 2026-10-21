import { router } from 'expo-router';
import { WarningCircleIcon } from '@/components/icons';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Emoji, type EmojiName } from '@/components/Emoji';
import { Card, ListCard, Photo, Row, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { ProgressBar } from '@/components/Progress';
import { bank, topicsFor } from '@/data/bank';
import { ENGLISH_ID } from '@/data/catalog';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { accuracy, streak, weakTopics } from '@/logic/progress';
import { localDate, useStore } from '@/store/AppStore';
import { radius, space, subjectColors, useTheme } from '@/theme/theme';

export default function Progress() {
  const { data } = useStore();
  const { c } = useTheme();
  const subjects = [ENGLISH_ID, ...data.profile!.subjects];
  const answered = Object.keys(data.history).length;

  if (answered === 0) {
    return (
      <Screen tab>
        <AkadaText variant="h1">Your progress</AkadaText>
        <Photo source={images.signup} height={220} />
        <Stack style={{ alignItems: 'center' }}>
          <AkadaText variant="h2" align="center">No progress yet</AkadaText>
          <AkadaText variant="bodyMedium" color="textSecondary" align="center">Answer your first questions and your stats, weak topics and streak will show up here.</AkadaText>
        </Stack>
        <Button label="Start practising" block onPress={() => router.push('/(tabs)/practice')} />
      </Screen>
    );
  }

  const today = localDate();
  const stats: [string, string, EmojiName][] = [
    [answered.toLocaleString(), 'Questions answered', 'chart'],
    [`${accuracy(data.history, bank.questions) ?? 0}%`, 'Accuracy', 'target'],
    [`${streak(data.practiceDays, today)} days`, 'Current streak', 'fire'],
    [String(data.mocks.length), 'Mock tests taken', 'trophy'],
  ];
  const weak = weakTopics(data.history, bank.questions);
  const mocks = data.mocks.slice(-4);

  // Streak calendar for the current month, Monday first.
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => i - offset + 1);
  const iso = (d: number) => localDate(new Date(now.getFullYear(), now.getMonth(), d).getTime());
  const practisedThisMonth = cells.filter(d => d >= 1 && d <= daysInMonth && data.practiceDays.includes(iso(d))).length;

  return (
    <Screen tab>
      <Stack gap={space[4]}><AkadaText variant="h1">Your progress</AkadaText><AkadaText variant="bodyMedium" color="textSecondary">All time · on this phone</AkadaText></Stack>
      <Stack gap={space[12]}>
        {[0, 2].map(s => (
          <Row key={s} align="stretch">
            {stats.slice(s, s + 2).map(([v, l, e]) => <Card key={l} style={{ flex: 1 }} gap={space[8]}><Emoji name={e} size={32} /><AkadaText variant="h2">{v}</AkadaText><AkadaText variant="bodySmall" color="textSecondary">{l}</AkadaText></Card>)}
          </Row>
        ))}
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">Accuracy by subject</AkadaText>
        <Card gap={space[16]}>
          {subjects.map(id => { const m = subjectMeta(id); const a = accuracy(data.history, bank.questions, id); return (
            <Stack key={id}>
              <Row><AkadaText variant="labelMedium" style={{ flex: 1 }}>{m.name}</AkadaText><AkadaText variant="labelMedium" color="textSecondary">{a === null ? 'Not started' : `${a}%`}</AkadaText></Row>
              <ProgressBar value={(a ?? 0) / 100} color={subjectColors(c, m.color).strong} />
            </Stack>
          ); })}
        </Card>
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">Mock test scores</AkadaText>
        <Card>
          {mocks.length ? (
            <Row align="flex-end" gap={space[16]} style={{ height: 160 }}>
              {mocks.map((m, i) => (
                <View key={m.at} style={{ flex: 1, alignItems: 'center', gap: space[4] }}>
                  <AkadaText variant="labelSmall" color={i === mocks.length - 1 ? 'textPrimary' : 'textSecondary'}>{m.total}%</AkadaText>
                  <View style={{ width: 40, height: Math.max(4, (m.total / 100) * 110), borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md, backgroundColor: i === mocks.length - 1 ? c.primary : c.primaryContainer }} />
                  <AkadaText variant="bodySmall" color="textTertiary">{new Date(m.at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</AkadaText>
                </View>
              ))}
            </Row>
          ) : <AkadaText variant="bodyMedium" color="textSecondary">Take a mock test to see your score trend here.</AkadaText>}
        </Card>
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">Weak topics</AkadaText>
        {weak.length ? (
          <ListCard>
            {weak.map((w, i) => <ListRow key={w.topicId} label={`${subjectMeta(w.subjectId).name} · ${topicsFor(w.subjectId).find(t => t.id === w.topicId)?.name}`} value={`${w.accuracy}%`} icon={WarningCircleIcon} last={i === weak.length - 1} onPress={() => router.push({ pathname: '/practice/session', params: { subject: w.subjectId, topic: w.topicId } })} />)}
          </ListCard>
        ) : <Card><AkadaText variant="bodyMedium" color="textSecondary">No weak topics yet. Nice work!</AkadaText></Card>}
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">Streak calendar</AkadaText>
        <Card>
          <Row><AkadaText variant="labelLarge" style={{ flex: 1 }}>{now.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}</AkadaText><Emoji name="fire" size={24} /></Row>
          <Row gap={space[4]}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <AkadaText key={i} variant="labelSmall" color="textTertiary" align="center" style={{ flex: 1 }}>{d}</AkadaText>)}</Row>
          {Array.from({ length: cells.length / 7 }, (_, w) => (
            <Row key={w} gap={space[4]}>
              {cells.slice(w * 7, w * 7 + 7).map((d, i) => {
                const inMonth = d >= 1 && d <= daysInMonth; const on = inMonth && data.practiceDays.includes(iso(d)); const isToday = inMonth && d === now.getDate();
                return (
                  <View key={i} style={{ flex: 1, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c.successContainer : 'transparent', borderWidth: isToday ? 2 : 0, borderColor: c.borderFocus }}>
                    {inMonth && <AkadaText variant="labelSmall" style={{ color: on ? c.success : d > now.getDate() ? c.textTertiary : c.textSecondary }}>{d}</AkadaText>}
                  </View>
                );
              })}
            </Row>
          ))}
          <AkadaText variant="bodySmall" color="textSecondary">{practisedThisMonth} {practisedThisMonth === 1 ? 'day' : 'days'} practised this month</AkadaText>
        </Card>
      </Stack>
    </Screen>
  );
}
