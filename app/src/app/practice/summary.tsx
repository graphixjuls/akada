import { router, useLocalSearchParams } from 'expo-router';
import { XCircleIcon, XIcon } from '@/components/icons';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { IconButton } from '@/components/IconButton';
import { Card, Columns, ListCard, Photo, Row, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { questionById, topicsFor } from '@/data/bank';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { streak } from '@/logic/progress';
import { localDate, useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
import { space } from '@/theme/theme';

export default function Summary() {
  const p = useLocalSearchParams<{ correct: string; total: string; minutes: string; subject: string; topic: string; wrong: string; first: string; quick: string }>();
  const { data } = useStore();
  const { desktop } = useLayout();
  const correct = Number(p.correct), total = Number(p.total);
  const acc = total ? Math.round((correct / total) * 100) : 0;
  const wrong = (p.wrong ?? '').split(',').filter(Boolean);
  const days = streak(data.practiceDays, localDate());
  const today = data.today.date === localDate() ? data.today.minutes : 0;
  const goal = data.profile?.dailyGoalMin ?? 30;
  const topic = p.topic ? topicsFor(p.subject).find(t => t.id === p.topic)?.name : undefined;
  const label = p.quick ? 'Quick practice' : p.first ? 'Your first practice' : topic ? `${subjectMeta(p.subject).name} · ${topic}` : subjectMeta(p.subject).name;
  return (
    <Screen footer={<>
      <Button label={p.first ? 'Back to Home' : 'Practise another topic'} block onPress={() => (p.first ? router.replace('/(tabs)') : router.replace({ pathname: '/practice/[subject]', params: { subject: p.subject } }))} />
      {wrong.length > 0 && <Button label="Review answers" variant="ghost" block onPress={() => router.push({ pathname: '/review', params: { ids: wrong.join(',') } })} />}
    </>}>
      <View><IconButton icon={XIcon} label="Close" onPress={() => router.replace('/(tabs)')} /></View>
      <Columns sideWidth={420}
        main={<>
      <Photo source={images.celebrate} height={desktop ? 300 : 200} />
      <Row gap={space[8]}><AkadaText variant="h1">{acc >= 50 ? 'Session complete!' : 'Good effort!'}</AkadaText><Emoji name={acc >= 50 ? 'party' : 'strong'} size={32} /></Row>
      <AkadaText variant="bodyMedium" color="textSecondary">{label} · {total} questions</AkadaText>
      <Row align="stretch">
        {[[`${correct}/${total}`, 'Score'], [`${acc}%`, 'Accuracy'], [`${p.minutes} min`, 'Time']].map(([v, l]) => <Card key={l} style={{ flex: 1 }} gap={space[4]}><AkadaText variant="h2">{v}</AkadaText><AkadaText variant="bodySmall" color="textSecondary">{l}</AkadaText></Card>)}
      </Row>
      <Card tone="warningContainer">
        <Row><Emoji name="fire" size={40} /><Stack gap={space[4]} style={{ flex: 1 }}>
          <AkadaText variant="labelLarge">{days <= 1 ? 'Your streak has started: day 1' : `${days}-day streak`}</AkadaText>
          <AkadaText variant="bodySmall" color="textSecondary">{today >= goal ? `Today's goal reached: ${goal} / ${goal} min` : `Today: ${today} / ${goal} min. Come back tomorrow to keep it going.`}</AkadaText>
        </Stack></Row>
      </Card>
        </>}
        side={<>
      {wrong.length > 0 && (
        <Stack gap={space[12]}>
          <AkadaText variant="h3">Review these</AkadaText>
          <ListCard>
            {wrong.map((id, i) => { const q = questionById(id); return <ListRow key={id} label={q ? q.text.slice(0, 40) + (q.text.length > 40 ? '…' : '') : id} value="Wrong" icon={XCircleIcon} last={i === wrong.length - 1} onPress={() => router.push({ pathname: '/review', params: { ids: id } })} />; })}
          </ListCard>
        </Stack>
      )}
        </>}
      />
    </Screen>
  );
}
