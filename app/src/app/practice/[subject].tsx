import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon, CheckCircleIcon, NotebookIcon, ShuffleIcon } from '@/components/icons';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { SubjectTag } from '@/components/Chips';
import { EmptyState } from '@/components/Feedback';
import { IconButton } from '@/components/IconButton';
import { ListCard, Photo, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { ProgressBar } from '@/components/Progress';
import { bank, questionsFor, topicsFor } from '@/data/bank';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import type { ClassLevel } from '@/data/types';
import { subjectProgress } from '@/logic/progress';
import { useStore } from '@/store/AppStore';
import { space, subjectColors, useTheme } from '@/theme/theme';

const PHOTO: Record<string, keyof typeof images> = { english: 'study', mathematics: 'examGoal', physics: 'cbt', chemistry: 'science', biology: 'science' };
const LEVELS: ClassLevel[] = ['SS1', 'SS2', 'SS3'];

export default function Topics() {
  const { subject } = useLocalSearchParams<{ subject: string }>();
  const { data } = useStore();
  const { c } = useTheme();
  const m = subjectMeta(subject);
  const topics = topicsFor(subject);
  const total = questionsFor(subject).length;
  const prog = subjectProgress(data.history, bank.questions, subject);
  return (
    <Screen>
      <View><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /></View>
      <Photo source={images[PHOTO[subject] ?? 'study']} height={160} />
      <Stack>
        <SubjectTag label={m.name} color={m.color} />
        <AkadaText variant="h1">{m.name} topics</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary">{Math.round(prog * 100)}% complete · {topics.length} topics · {total} questions</AkadaText>
        <ProgressBar value={prog} color={subjectColors(c, m.color).strong} />
      </Stack>
      {topics.length ? (
        <>
          <Button label={`Mixed ${m.name} practice`} variant="tonal" leadingIcon={ShuffleIcon} block onPress={() => router.push({ pathname: '/practice/session', params: { subject } })} />
          {LEVELS.map(level => {
            const inLevel = topicsFor(subject, level);
            if (!inLevel.length) return null;
            return (
              <Stack key={level} gap={space[12]}>
                <AkadaText variant="h3">{level}</AkadaText>
                <ListCard>
                  {inLevel.map((t, i) => {
                    const qs = questionsFor(subject, t.id);
                    const done = qs.filter(q => data.history[q.id]).length;
                    const complete = done === qs.length && qs.length > 0;
                    return <ListRow key={t.id} label={t.name} value={complete ? 'Done' : `${done} / ${qs.length}`} icon={complete ? CheckCircleIcon : NotebookIcon} last={i === inLevel.length - 1} onPress={() => router.push({ pathname: '/practice/session', params: { subject, topic: t.id } })} />;
                  })}
                </ListCard>
              </Stack>
            );
          })}
        </>
      ) : (
        <EmptyState emoji="pencil" title="Questions coming soon" body={`There are no questions for ${m.name} yet. Try another subject for now.`} />
      )}
    </Screen>
  );
}
