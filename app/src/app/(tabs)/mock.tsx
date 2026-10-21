import { router } from 'expo-router';
import { ClockIcon, ListChecksIcon, QuestionIcon, TrophyIcon } from '@/components/icons';
import { useState } from 'react';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Chip, Wrap } from '@/components/Chips';
import { Dialog } from '@/components/Feedback';
import { Card, Columns, ListCard, Photo, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { bank, buildMock, questionById } from '@/data/bank';
import { MOCK_FORMAT } from '@/data/catalog';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { createExam, examReducer, examSubjects, gradeExam } from '@/logic/exam';
import { formatClock, mockDurationMs, remainingMs } from '@/logic/timer';
import { useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
import { space } from '@/theme/theme';

export default function MockInstructions() {
  const { data, setExam, finishExam } = useStore();
  const mine = data.profile!.subjects;
  // Any of the student's subjects. Starts with the first four, so a test is about an hour.
  const [chosen, setChosen] = useState<string[]>(() => mine.slice(0, 4));
  const included = mine.filter(s => chosen.includes(s));
  const count = included.length * MOCK_FORMAT.questionsPerSubject;
  const minutes = Math.round(mockDurationMs(count) / 60_000);
  const toggle = (id: string) => setChosen(chosen.includes(id) ? chosen.filter(s => s !== id) : [...chosen, id]);
  const active = data.activeExam && data.activeExam.submittedAt === null ? data.activeExam : null;
  const [dismissed, setDismissed] = useState(false);
  const { desktop } = useLayout();
  const [openedAt] = useState(() => Date.now());
  const left = active ? remainingMs(active.startedAt, active.durationMs, openedAt) : 0;
  const where = active ? questionById(active.questionIds[active.current]) : undefined;

  // Starting a test here counts as an answer to the "Continue?" prompt; this tab stays mounted under the test.
  const start = () => {
    const ids = buildMock(included);
    setDismissed(true); setExam(createExam(ids, Date.now(), mockDurationMs(ids.length))); router.push('/exam');
  };
  const endActive = () => {
    if (active) {
      const done = examReducer(active, { type: 'submit', at: Date.now() });
      setExam(done);
      finishExam(gradeExam(done, bank.questions, examSubjects(done, bank.questions)).total);
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
      {!active && (
        <Card gap={space[12]}>
          <AkadaText variant="labelLarge">Subjects in this test</AkadaText>
          <Wrap>{mine.map(id => <Chip key={id} label={subjectMeta(id).name} selected={chosen.includes(id)} onPress={() => toggle(id)} />)}</Wrap>
        </Card>
      )}
      <ListCard>
        <ListRow label="Subjects" value={String(included.length)} icon={ListChecksIcon} chevron={false} />
        <ListRow label="Questions" value={`${count} (${MOCK_FORMAT.questionsPerSubject} per subject)`} icon={QuestionIcon} chevron={false} />
        <ListRow label="Time" value={`${minutes} min`} icon={ClockIcon} chevron={false} />
        <ListRow label="Score" value="Percentage" icon={TrophyIcon} chevron={false} last />
      </ListCard>
      <Card gap={8}>
        <AkadaText variant="labelLarge">How it works</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary">{'• Switch subjects with the tabs at the top.\n• Flag questions you want to come back to.\n• The test submits itself when time runs out.\n• Your answers save even if the app closes.'}</AkadaText>
        <AkadaText variant="bodySmall" color="textTertiary">You have {MOCK_FORMAT.secondsPerQuestion} seconds per question on average.</AkadaText>
      </Card>
      <Button label={active ? 'Continue test' : included.length ? 'Start test' : 'Pick at least one subject'} disabled={!active && !included.length} block onPress={active ? () => router.push('/exam') : start} />
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
