import { router } from 'expo-router';
import { ClockIcon, ListChecksIcon, QuestionIcon, TrophyIcon } from '@/components/icons';
import { useMemo, useState } from 'react';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Feedback';
import { Card, Columns, ListCard, Photo, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { bank, buildMock, questionById } from '@/data/bank';
import { ENGLISH_ID, MOCK_FORMAT } from '@/data/catalog';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { createExam, examReducer, gradeExam } from '@/logic/exam';
import { formatClock, mockDurationMs, remainingMs } from '@/logic/timer';
import { useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
import { space } from '@/theme/theme';

export default function MockInstructions() {
  const { data, setExam, finishExam } = useStore();
  const subjectsKey = data.profile!.subjects.join(',');
  const ids = useMemo(() => buildMock(subjectsKey.split(',')), [subjectsKey]);
  const minutes = Math.round(mockDurationMs(ids.length) / 60_000);
  const active = data.activeExam && data.activeExam.submittedAt === null ? data.activeExam : null;
  const [dismissed, setDismissed] = useState(false);
  const { desktop } = useLayout();
  const [openedAt] = useState(() => Date.now());
  const left = active ? remainingMs(active.startedAt, active.durationMs, openedAt) : 0;
  const where = active ? questionById(active.questionIds[active.current]) : undefined;

  // Starting a test here counts as an answer to the "Continue?" prompt; this tab stays mounted under the test.
  const start = () => { setDismissed(true); setExam(createExam(ids, Date.now(), mockDurationMs(ids.length))); router.push('/exam'); };
  const endActive = () => {
    if (active) {
      const done = examReducer(active, { type: 'submit', at: Date.now() });
      setExam(done);
      finishExam(gradeExam(done, bank.questions, [ENGLISH_ID, ...data.profile!.subjects]).total);
    }
    setDismissed(true);
    router.push('/exam/results');
  };

  return (
    <Screen tab>
      <Columns sideWidth={420} gap={desktop ? space[40] : space[24]}
        main={<>
          <Photo source={images.cbt} height={desktop ? 340 : 200} />
          <Stack>
            <AkadaText variant={desktop ? 'display' : 'h1'}>Mock test</AkadaText>
            <AkadaText variant={desktop ? 'bodyLarge' : 'bodyMedium'} color="textSecondary">Test yourself under exam conditions. You get a new mix of questions every time.</AkadaText>
          </Stack>
        </>}
        side={<>
      <ListCard>
        <ListRow label="Subjects" value="English + 3" icon={ListChecksIcon} chevron={false} />
        <ListRow label="Questions" value={`${ids.length} (${MOCK_FORMAT.questionsPerSubject} per subject)`} icon={QuestionIcon} chevron={false} />
        <ListRow label="Time" value={`${minutes} min`} icon={ClockIcon} chevron={false} />
        <ListRow label="Score" value="Percentage" icon={TrophyIcon} chevron={false} last />
      </ListCard>
      <Card gap={8}>
        <AkadaText variant="labelLarge">How it works</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary">{'• Switch subjects with the tabs at the top.\n• Flag questions you want to come back to.\n• The test submits itself when time runs out.\n• Your answers save even if the app closes.'}</AkadaText>
        <AkadaText variant="bodySmall" color="textTertiary">You have {MOCK_FORMAT.secondsPerQuestion} seconds per question on average.</AkadaText>
      </Card>
      <Button label={active ? 'Continue test' : 'Start test'} block onPress={active ? () => router.push('/exam') : start} />
        </>}
      />
      <Dialog
        visible={!!active && !dismissed && left > 0}
        title="Continue your mock test?"
        body={`You left at ${where ? subjectMeta(where.subjectId).name : 'your test'}, question ${(active?.current ?? 0) + 1}. The timer kept running, like in a real exam: ${formatClock(left)} left.`}
        primaryLabel="Continue test"
        onPrimary={() => { setDismissed(true); router.push('/exam'); }}
        secondaryLabel="End and see results"
        onSecondary={endActive}
      />
    </Screen>
  );
}
