import { router } from 'expo-router';
import { FlagIcon, ListChecksIcon, XIcon } from '@/components/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chips';
import { AnswerOption, QuestionNumber, Timer } from '@/components/Exam';
import { Dialog, useToast } from '@/components/Feedback';
import { IconButton } from '@/components/IconButton';
import { Row, Screen, Stack } from '@/components/Layout';
import { bank, questionById } from '@/data/bank';
import { subjectMeta } from '@/data/subjectMeta';
import { examCounts, examReducer, examSubjects, gradeExam, numberState, type ExamAction } from '@/logic/exam';
import { CRITICAL_MS, remainingMs } from '@/logic/timer';
import { useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
import { radius, space, useTheme } from '@/theme/theme';

export default function Exam() {
  const { data, setExam, finishExam } = useStore();
  const { c } = useTheme();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { desktop } = useLayout();
  const exam = data.activeExam;
  const [now, setNow] = useState(() => Date.now());
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [timesUpSeen, setTimesUpSeen] = useState(false);
  const warned = useRef(false);

  // Tick once a second; re-sync immediately when the app comes back from the background.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    const sub = AppState.addEventListener('change', s => { if (s === 'active') setNow(Date.now()); });
    return () => { clearInterval(t); sub.remove(); };
  }, []);

  const subjectOrder = exam ? examSubjects(exam, bank.questions) : [];
  const left = exam ? remainingMs(exam.startedAt, exam.durationMs, now) : 0;
  const submit = useCallback(() => {
    if (!exam || exam.submittedAt !== null) return;
    const done = examReducer(exam, { type: 'submit', at: Date.now() });
    setExam(done);
    finishExam(gradeExam(done, bank.questions, examSubjects(done, bank.questions)).total);
  }, [exam, setExam, finishExam]);

  useEffect(() => {
    if (!exam || exam.submittedAt !== null) return;
    if (left <= 0) submit();
    else if (left < CRITICAL_MS && !warned.current) { warned.current = true; toast('Less than 1 minute left. Your answers are saved.', 'error'); }
  }, [left, exam, submit, toast]);

  // Computers: A–D choose, ← → move between questions, F flags.
  useEffect(() => {
    if (Platform.OS !== 'web' || !exam || exam.submittedAt !== null || confirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const id = exam.questionIds[exam.current];
      const pick = 'abcd'.indexOf(k);
      let action: ExamAction | null = null;
      if (pick >= 0) action = { type: 'select', questionId: id, option: pick };
      else if (k === 'arrowright') action = { type: 'next' };
      else if (k === 'arrowleft') action = { type: 'prev' };
      else if (k === 'f') action = { type: 'toggleFlag', questionId: id };
      if (action) { e.preventDefault(); setExam(examReducer(exam, action)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exam, confirm, setExam]);

  if (!exam) return <Screen><AkadaText variant="h2">No test in progress</AkadaText><Button label="Back" onPress={() => router.back()} /></Screen>;

  const q = questionById(exam.questionIds[exam.current])!;
  const subjectIdx = exam.questionIds.map((id, i) => ({ i, s: questionById(id)?.subjectId })).filter(x => x.s === q.subjectId).map(x => x.i);
  const posInSubject = subjectIdx.indexOf(exam.current);
  const dispatch = (a: ExamAction) => setExam(examReducer(exam, a));
  const counts = examCounts(exam);
  const flagged = !!exam.flagged[q.id];
  const strip = subjectIdx.slice(Math.max(0, Math.min(posInSubject - 2, subjectIdx.length - 6)), Math.max(0, Math.min(posInSubject - 2, subjectIdx.length - 6)) + 6);

  const goto = (i: number) => dispatch({ type: 'goto', index: i });
  const subjectTabs = subjectOrder.map(sid => {
    const first = exam.questionIds.findIndex(id => questionById(id)?.subjectId === sid);
    const name = subjectMeta(sid).name;
    if (first < 0) return null;
    const short = name.replace(' Language', '').replace('Further Mathematics', 'Further Maths');
    return <View key={sid}><Chip label={desktop ? name : short} kind="radio" selected={sid === q.subjectId} onPress={() => goto(first)} /></View>;
  });
  const summary = (
    <Stack gap={space[4]} style={{ flex: 1 }}>
      <AkadaText variant="h3">All questions · {counts.total}</AkadaText>
      <AkadaText variant="bodySmall" color="textSecondary">{counts.answered} answered · {counts.flagged} flagged · {counts.unanswered} left</AkadaText>
    </Stack>
  );
  const groups = (onPick: (i: number) => void) => subjectOrder.map(sid => {
    const idxs = exam.questionIds.map((id, i) => ({ i, s: questionById(id)?.subjectId })).filter(x => x.s === sid).map(x => x.i);
    if (!idxs.length) return null;
    return (
      <Stack key={sid} gap={space[8]}>
        <AkadaText variant="labelMedium">{subjectMeta(sid).name}</AkadaText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
          {idxs.map((i, n) => <QuestionNumber key={i} n={n + 1} state={numberState(exam, i)} onPress={() => onPick(i)} />)}
        </View>
      </Stack>
    );
  });
  const questionHeader = (
    <Row>
      <Stack gap={space[4]} style={{ flex: 1 }}>
        <AkadaText variant="labelMedium">{subjectMeta(q.subjectId).name} · Question {posInSubject + 1} of {subjectIdx.length}</AkadaText>
      </Stack>
      <IconButton icon={FlagIcon} active={flagged} label={flagged ? 'Remove flag' : 'Flag question'} onPress={() => dispatch({ type: 'toggleFlag', questionId: q.id })} />
    </Row>
  );
  const options = (
    <Stack gap={space[12]}>
      {q.options.map((o, i) => <AnswerOption key={i} letter={'ABCD'[i]} text={o} state={exam.answers[q.id] === i ? 'Selected' : 'Default'} onPress={() => dispatch({ type: 'select', questionId: q.id, option: i })} />)}
    </Stack>
  );
  const prevNext = (
    <Row>
      <View style={{ flex: 1 }}><Button label="Previous" variant="outline" block disabled={exam.current === 0} onPress={() => dispatch({ type: 'prev' })} /></View>
      <View style={{ flex: 1 }}><Button label="Next" block disabled={exam.current === exam.questionIds.length - 1} onPress={() => dispatch({ type: 'next' })} /></View>
    </Row>
  );
  const dialogs = (
    <>
      <Dialog
        visible={confirm}
        title="Submit your test?"
        body={`You have ${counts.unanswered} unanswered and ${counts.flagged} flagged questions. You can’t change answers after you submit.`}
        primaryLabel="Submit test"
        onPrimary={() => { setConfirm(false); submit(); router.replace('/exam/results'); }}
        secondaryLabel="Keep going"
        onSecondary={() => setConfirm(false)}
      />
      <Dialog
        visible={!timesUpSeen && exam.submittedAt !== null && left <= 0}
        title="Time's up!"
        body={`We submitted your test automatically. You answered ${counts.answered} of ${counts.total} questions.`}
        primaryLabel="See my results"
        onPrimary={() => { setTimesUpSeen(true); router.replace('/exam/results'); }}
        secondaryLabel="Back to Home"
        onSecondary={() => { setTimesUpSeen(true); router.replace('/(tabs)'); }}
      />
    </>
  );

  // Computers: the question on the left and the question navigator always visible on the right.
  if (desktop) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bgCanvas }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[16], paddingHorizontal: space[48], paddingVertical: space[16], backgroundColor: c.bgSurface, borderBottomWidth: 1, borderBottomColor: c.borderDefault }}>
          <Timer ms={left} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexShrink: 1 }} contentContainerStyle={{ gap: space[8] }}>{subjectTabs}</ScrollView>
          <View style={{ flex: 1 }} />
          <Button label="Submit" variant="outline" size="small" onPress={() => setConfirm(true)} />
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 64, paddingTop: space[40], paddingBottom: space[32], gap: space[24], maxWidth: 880 }}>
            {questionHeader}
            <AkadaText variant="h2">{q.text}</AkadaText>
            {options}
            {prevNext}
            {Platform.OS === 'web' && <AkadaText variant="bodySmall" color="textTertiary">Keys: A–D to choose · ← → to move · F to flag</AkadaText>}
          </ScrollView>
          <View style={{ width: 400, backgroundColor: c.bgSurface, borderLeftWidth: 1, borderLeftColor: c.borderDefault }}>
            <ScrollView contentContainerStyle={{ padding: space[24], paddingTop: space[32], gap: space[20] }}>
              {summary}
              {groups(goto)}
            </ScrollView>
          </View>
        </View>
        {dialogs}
      </SafeAreaView>
    );
  }

  return (
    <Screen
      gap={space[16]}
      width="focus"
      footer={<>
        <Row gap={space[8]}>
          {strip.map(i => <QuestionNumber key={i} n={subjectIdx.indexOf(i) + 1} state={numberState(exam, i)} onPress={() => goto(i)} />)}
          <View style={{ flex: 1 }} />
          <IconButton icon={ListChecksIcon} variant="tonal" label="All questions" onPress={() => setSheet(true)} />
        </Row>
        {prevNext}
      </>}
    >
      <Row>
        <Timer ms={left} />
        <View style={{ flex: 1 }} />
        <Button label="Submit" variant="outline" size="small" onPress={() => setConfirm(true)} />
      </Row>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: space[8] }}>{subjectTabs}</ScrollView>
      {questionHeader}
      <AkadaText variant="question">{q.text}</AkadaText>
      {options}

      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <Pressable style={{ flex: 1, backgroundColor: c.bgScrim }} onPress={() => setSheet(false)} accessibilityLabel="Close question list" />
        <View style={{ backgroundColor: c.bgSurface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space[20], paddingBottom: space[24] + insets.bottom, gap: space[16], maxHeight: '75%' }}>
          <Row>
            {summary}
            <IconButton icon={XIcon} label="Close" onPress={() => setSheet(false)} />
          </Row>
          <ScrollView contentContainerStyle={{ gap: space[16] }}>
            {groups(i => { goto(i); setSheet(false); })}
          </ScrollView>
        </View>
      </Modal>
      {dialogs}
    </Screen>
  );
}
