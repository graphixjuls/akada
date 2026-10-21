import { router } from 'expo-router';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Card, Grid, ListCard, Photo, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { SubjectCard } from '@/components/SubjectCard';
import { bank } from '@/data/bank';
import { ENGLISH_ID, subjects as allSubjects } from '@/data/catalog';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { subjectProgress } from '@/logic/progress';
import { useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
import { space, useTheme } from '@/theme/theme';

export default function Practice() {
  const { data } = useStore();
  const { c } = useTheme();
  const { wide, desktop } = useLayout();
  const subjects = [ENGLISH_ID, ...data.profile!.subjects];
  const firstTime = data.sessions === 0;
  const others = allSubjects.filter(s => !subjects.includes(s.id));
  const open = (id: string) => router.push({ pathname: '/practice/[subject]', params: { subject: id } });
  const pct = (id: string) => subjectProgress(data.history, bank.questions, id);
  const otherRow = (s: (typeof others)[number], last: boolean) => <ListRow key={s.id} label={s.name} value={pct(s.id) ? `${Math.round(pct(s.id) * 100)}%` : undefined} icon={subjectMeta(s.id).icon} last={last} onPress={() => open(s.id)} />;
  // On wide screens "More subjects" splits into two lists side by side.
  const half = Math.ceil(others.length / 2);

  const quickText = (
    <Stack gap={space[12]} style={wide ? { flex: 1 } : undefined}>
      <AkadaText variant={wide ? 'h2' : 'h3'}>{firstTime ? 'Not sure where to start?' : 'Quick practice'}</AkadaText>
      <AkadaText variant={wide ? 'bodyLarge' : 'bodyMedium'} color="textSecondary">{firstTime ? 'Start with English. Everyone needs it, and it takes about 5 minutes.' : '10 mixed questions from all your subjects. About 8 minutes.'}</AkadaText>
      <View style={wide ? { alignSelf: 'flex-start' } : undefined}>
        <Button label={firstTime ? 'Start with English' : 'Start quick practice'} block={!wide} onPress={() => router.push({ pathname: '/practice/session', params: firstTime ? { subject: ENGLISH_ID, first: '1' } : { quick: '1' } })} />
      </View>
    </Stack>
  );

  return (
    <Screen tab>
      <Stack>
        <AkadaText variant="h1">Practice</AkadaText>
        <AkadaText variant={wide ? 'bodyLarge' : 'bodyMedium'} color="textSecondary">{firstTime ? 'Pick any subject to begin. Every answer comes with an explanation.' : 'Pick a subject, then a topic. Every answer comes with an explanation.'}</AkadaText>
      </Stack>
      <Card tone={firstTime ? 'primaryContainer' : undefined} style={{ ...(firstTime ? { borderColor: c.primary, borderWidth: 2 } : null), ...(wide ? { flexDirection: 'row', alignItems: 'center', gap: space[32], padding: space[24] } : null) }}>
        {wide ? <View style={{ width: desktop ? 320 : 240 }}><Photo source={images.study} height={180} rounded="lg" /></View> : <Photo source={images.study} height={140} rounded="md" />}
        {quickText}
      </Card>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">Your subjects</AkadaText>
        {wide ? (
          <Grid columns={desktop ? 4 : 2}>
            {subjects.map(id => {
              const m = subjectMeta(id); const p = pct(id);
              return <SubjectCard key={id} title={m.name} subtitle={m.topicsLine} color={m.color} emoji={m.emoji} progress={p} status={p ? `${Math.round(p * 100)}% complete` : 'Not started'} onPress={() => open(id)} />;
            })}
          </Grid>
        ) : (
          <ListCard>
            {subjects.map((id, i) => {
              const m = subjectMeta(id); const p = pct(id);
              return <ListRow key={id} label={m.name} value={p ? `${Math.round(p * 100)}%` : 'Not started'} icon={m.icon} last={i === subjects.length - 1} onPress={() => open(id)} />;
            })}
          </ListCard>
        )}
      </Stack>
      <Stack gap={space[12]}>
        <AkadaText variant="h3">More subjects</AkadaText>
        {wide ? (
          <Grid columns={2}>
            <ListCard>{others.slice(0, half).map((s, i) => otherRow(s, i === half - 1))}</ListCard>
            <ListCard>{others.slice(half).map((s, i) => otherRow(s, i === others.length - half - 1))}</ListCard>
          </Grid>
        ) : (
          <ListCard>{others.map((s, i) => otherRow(s, i === others.length - 1))}</ListCard>
        )}
      </Stack>
    </Screen>
  );
}
