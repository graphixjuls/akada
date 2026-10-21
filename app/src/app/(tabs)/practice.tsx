import { router } from 'expo-router';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Card, ListCard, Photo, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { bank } from '@/data/bank';
import { ENGLISH_ID, subjects as allSubjects } from '@/data/catalog';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { subjectProgress } from '@/logic/progress';
import { useStore } from '@/store/AppStore';
import { space, useTheme } from '@/theme/theme';

export default function Practice() {
  const { data } = useStore();
  const { c } = useTheme();
  const subjects = [ENGLISH_ID, ...data.profile!.subjects];
  const firstTime = data.sessions === 0;
  const others = allSubjects.filter(s => !subjects.includes(s.id));
  return (
    <Screen tab>
      <Stack>
        <AkadaText variant="h1">Practice</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary">{firstTime ? 'Pick any subject to begin. Every answer comes with an explanation.' : 'Pick a subject, then a topic. Every answer comes with an explanation.'}</AkadaText>
      </Stack>
      <Card tone={firstTime ? 'primaryContainer' : undefined} style={firstTime ? { borderColor: c.primary, borderWidth: 2 } : undefined}>
        <Photo source={images.study} height={140} rounded="md" />
        <AkadaText variant="h3">{firstTime ? 'Not sure where to start?' : 'Quick practice'}</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary">{firstTime ? 'Start with English. Everyone needs it, and it takes about 5 minutes.' : 'Mixed questions from all your subjects. About 8 minutes.'}</AkadaText>
        <Button label={firstTime ? 'Start with English' : 'Start quick practice'} block onPress={() => router.push({ pathname: '/practice/session', params: firstTime ? { subject: ENGLISH_ID, first: '1' } : { quick: '1' } })} />
      </Card>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">Your subjects</AkadaText>
        <ListCard>
          {subjects.map((id, i) => {
            const m = subjectMeta(id);
            const p = subjectProgress(data.history, bank.questions, id);
            return <ListRow key={id} label={m.name} value={p ? `${Math.round(p * 100)}%` : 'Not started'} icon={m.icon} last={i === subjects.length - 1} onPress={() => router.push({ pathname: '/practice/[subject]', params: { subject: id } })} />;
          })}
        </ListCard>
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">More subjects</AkadaText>
        <ListCard>
          {others.map((s, i) => {
            const p = subjectProgress(data.history, bank.questions, s.id);
            return <ListRow key={s.id} label={s.name} value={p ? `${Math.round(p * 100)}%` : undefined} icon={subjectMeta(s.id).icon} last={i === others.length - 1} onPress={() => router.push({ pathname: '/practice/[subject]', params: { subject: s.id } })} />;
          })}
        </ListCard>
      </Stack>
    </Screen>
  );
}
