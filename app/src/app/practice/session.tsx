import { router, useLocalSearchParams } from 'expo-router';
import { BookmarkSimpleIcon, CheckCircleIcon, LightbulbIcon, XCircleIcon, XIcon } from 'phosphor-react-native';
import { useReducer, useState } from 'react';
import { View } from 'react-native';
import { AkadaIcon } from '@/components/AkadaIcon';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { SubjectTag } from '@/components/Chips';
import { AnswerOption } from '@/components/Exam';
import { Dialog, EmptyState, useToast } from '@/components/Feedback';
import { IconButton } from '@/components/IconButton';
import { Card, Row, Screen, Stack } from '@/components/Layout';
import { ProgressBar } from '@/components/Progress';
import { pickQuestions, questionsFor, topicsFor } from '@/data/bank';
import { ENGLISH_ID } from '@/data/catalog';
import { subjectMeta } from '@/data/subjectMeta';
import type { Question } from '@/data/types';
import { initialPractice, optionState, practiceReducer } from '@/logic/practice';
import { useStore } from '@/store/AppStore';
import { space, useTheme } from '@/theme/theme';

/** Questions per session. A topic session uses the whole topic when it is shorter. */
const SESSION_SIZE = 10;

function sessionQuestions(p: { subject?: string; topic?: string; quick?: string; first?: string }, subjects: string[], answered: (id: string) => boolean): Question[] {
  if (p.quick) return pickQuestions(subjects.flatMap(s => questionsFor(s)), SESSION_SIZE, answered);
  if (p.first) return pickQuestions(questionsFor(ENGLISH_ID), SESSION_SIZE, answered);
  return pickQuestions(questionsFor(p.subject ?? ENGLISH_ID, p.topic), SESSION_SIZE, answered);
}

export default function Session() {
  const params = useLocalSearchParams<{ subject?: string; topic?: string; quick?: string; first?: string }>();
  const { data, recordPractice, toggleBookmark } = useStore();
  const { c } = useTheme();
  const toast = useToast();
  const { subject, topic: topicId, quick, first } = params;
  const subjectsKey = (data.profile?.subjects ?? []).join(',');
  // Picked once when the session opens: answers saved during the session must not reshuffle it.
  const [questions] = useState(() => sessionQuestions({ subject, topic: topicId, quick, first }, [ENGLISH_ID, ...subjectsKey.split(',').filter(Boolean)], id => !!data.history[id]));
  const [s, dispatch] = useReducer(practiceReducer, initialPractice);
  const [leaving, setLeaving] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const q = questions[s.index];

  if (!q) return <Screen><EmptyState emoji="pencil" title="No questions here yet" body="There are no questions for this topic yet." action={<Button label="Go back" variant="ghost" onPress={() => router.back()} />} /></Screen>;

  const m = subjectMeta(q.subjectId);
  const topic = topicsFor(q.subjectId).find(t => t.id === q.topicId);
  const isLast = s.index === questions.length - 1;
  const bookmarked = data.bookmarks.includes(q.id);
  const correct = s.checked && s.outcomes[s.outcomes.length - 1];
  const minutes = () => Math.max(1, Math.round((Date.now() - startedAt) / 60_000));

  const save = () => recordPractice(s.outcomes.map((ok, i) => ({ questionId: questions[i].id, correct: ok })), minutes());
  const finish = () => {
    save();
    const wrong = s.outcomes.map((ok, i) => (ok ? null : questions[i].id)).filter(Boolean).join(',');
    router.replace({ pathname: '/practice/summary', params: { correct: String(s.outcomes.filter(Boolean).length), total: String(s.outcomes.length), minutes: String(minutes()), subject: q.subjectId, topic: params.topic ?? '', wrong, first: params.first ?? '', quick: params.quick ?? '' } });
  };

  return (
    <Screen footer={
      !s.checked
        ? <Button label="Check answer" disabled={s.selected === null} onPress={() => dispatch({ type: 'check', answerIndex: q.answerIndex })} block />
        : <Button label={isLast ? 'See results' : 'Next question'} onPress={() => (isLast ? finish() : dispatch({ type: 'next' }))} block />
    }>
      <Row>
        <IconButton icon={XIcon} label="Close" onPress={() => (s.outcomes.length ? setLeaving(true) : router.back())} />
        <View style={{ flex: 1 }}><ProgressBar value={(s.index + (s.checked ? 1 : 0)) / questions.length} /></View>
        <AkadaText variant="labelMedium" color="textSecondary">{s.index + 1} / {questions.length}</AkadaText>
        <IconButton icon={BookmarkSimpleIcon} active={bookmarked} label={bookmarked ? 'Remove bookmark' : 'Bookmark'} onPress={() => { toggleBookmark(q.id); toast(bookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks'); }} />
      </Row>
      <Stack gap={space[16]}>
        <Row><SubjectTag label={topic ? `${m.name} · ${topic.name}` : m.name} color={m.color} /><View style={{ flex: 1 }} />{topic && <AkadaText variant="labelSmall" color="textSecondary">{topic.level}</AkadaText>}</Row>
        <AkadaText variant="question" accessibilityRole="header">{q.text}</AkadaText>
        <Stack gap={space[12]}>
          {q.options.map((o, i) => <AnswerOption key={i} letter={'ABCD'[i]} text={o} state={optionState(s, i, q.answerIndex)} disabled={s.checked} onPress={() => dispatch({ type: 'select', option: i })} />)}
        </Stack>
        {params.first && s.index === 0 && !s.checked && (
          <Card tone="primaryContainer"><Row><AkadaIcon icon={LightbulbIcon} /><AkadaText variant="bodyMedium" style={{ flex: 1 }}>Tip: tap an answer, then tap Check answer. You’ll see if you’re right and why, straight away.</AkadaText></Row></Card>
        )}
        {s.checked && (
          <Card tone={correct ? 'successContainer' : 'errorContainer'} gap={space[8]}>
            <Row gap={space[8]}><AkadaIcon icon={correct ? CheckCircleIcon : XCircleIcon} active color={correct ? c.success : c.error} /><AkadaText variant="labelLarge">{correct ? 'Correct! Well done.' : `Not quite. The answer is ${'ABCD'[q.answerIndex]}.`}</AkadaText></Row>
            <AkadaText variant="bodyMedium" color="textSecondary">{q.explanation}</AkadaText>
          </Card>
        )}
      </Stack>
      <Dialog visible={leaving} title="Leave practice?" body="Your answers so far are saved. You can pick up this topic later." primaryLabel="Keep practising" onPrimary={() => setLeaving(false)} secondaryLabel="Leave" onSecondary={() => { setLeaving(false); save(); router.back(); }} />
    </Screen>
  );
}
