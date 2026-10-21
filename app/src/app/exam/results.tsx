import { router } from 'expo-router';
import { XIcon } from '@/components/icons';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { IconButton } from '@/components/IconButton';
import { Card, Columns, Photo, Row, Screen, Stack } from '@/components/Layout';
import { ProgressBar } from '@/components/Progress';
import { bank } from '@/data/bank';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { examSubjects, gradeExam } from '@/logic/exam';
import { formatClock } from '@/logic/timer';
import { useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
import { space, subjectColors, useTheme } from '@/theme/theme';

export default function Results() {
  const { data } = useStore();
  const { c } = useTheme();
  const { desktop } = useLayout();
  const exam = data.activeExam;
  if (!exam || exam.submittedAt === null) return <Screen><AkadaText variant="h2">No results yet</AkadaText><Button label="Back to Home" onPress={() => router.replace('/(tabs)')} /></Screen>;
  const order = examSubjects(exam, bank.questions);
  const r = gradeExam(exam, bank.questions, order);
  const previous = data.mocks.length > 1 ? data.mocks[data.mocks.length - 2].total : null;
  const delta = previous === null ? null : r.total - previous;
  const weakest = [...r.perSubject].sort((a, b) => a.score - b.score)[0];
  const used = Math.min(exam.submittedAt - exam.startedAt, exam.durationMs);
  const mood = r.total >= 70 ? 'partying' : r.total >= 50 ? 'cool' : 'strong';
  return (
    <Screen footer={<>
      <Button label="Review answers" block onPress={() => router.push({ pathname: '/review', params: { mode: 'exam' } })} />
      <Button label="Back to Home" variant="ghost" block onPress={() => router.replace('/(tabs)')} />
    </>}>
      <View><IconButton icon={XIcon} label="Close" onPress={() => router.replace('/(tabs)')} /></View>
      <Columns sideWidth={520}
        main={<>
      <Photo source={images.allSet} height={desktop ? 240 : 180} />
      <Card style={{ alignItems: 'center' }} gap={space[8]}>
        <Emoji name={mood} size={64} />
        <AkadaText variant="display" align="center">{r.total}%</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary" align="center">{delta === null ? `Your first mock test, ${data.profile!.name}. Well done for finishing!` : delta >= 0 ? `Great work, ${data.profile!.name}! That’s ${delta} points up on your last mock test.` : `${-delta} points down on your last mock test. Keep going, you’ve got this.`}</AkadaText>
      </Card>
        </>}
        side={<>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">By subject</AkadaText>
        <Card gap={space[16]}>
          {r.perSubject.map(s => { const m = subjectMeta(s.subjectId); return (
            <Stack key={s.subjectId}>
              <Row><AkadaText variant="labelMedium" style={{ flex: 1 }}>{m.name}</AkadaText><AkadaText variant="labelMedium" color="textSecondary">{s.score}%</AkadaText></Row>
              <ProgressBar value={s.score / 100} color={subjectColors(c, m.color).strong} />
            </Stack>
          ); })}
        </Card>
      </Stack>
      <Row align="stretch">
        {[[formatClock(used), 'Time used'], [`${r.counts.answered}/${r.counts.total}`, 'Answered'], [String(r.wrongIds.length), 'Wrong']].map(([v, l]) => <Card key={l} style={{ flex: 1 }} gap={space[4]}><AkadaText variant="h3">{v}</AkadaText><AkadaText variant="bodySmall" color="textSecondary">{l}</AkadaText></Card>)}
      </Row>
      {weakest && weakest.score < 100 && (
        <Card tone="warningContainer" gap={space[8]}>
          <AkadaText variant="labelLarge">Focus next: {subjectMeta(weakest.subjectId).name}</AkadaText>
          <AkadaText variant="bodyMedium" color="textSecondary">It was your lowest score in this test ({weakest.score}%). A short practice session there will help most.</AkadaText>
        </Card>
      )}
        </>}
      />
    </Screen>
  );
}
