import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon } from '@/components/icons';
import { useState } from 'react';
import { View } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { Chip, SubjectTag } from '@/components/Chips';
import { AnswerOption } from '@/components/Exam';
import { EmptyState } from '@/components/Feedback';
import { IconButton } from '@/components/IconButton';
import { Card, Row, Screen } from '@/components/Layout';
import { questionById } from '@/data/bank';
import { subjectMeta } from '@/data/subjectMeta';
import { useStore } from '@/store/AppStore';
import { space } from '@/theme/theme';

type Filter = 'all' | 'wrong' | 'flagged';

/** Review answers. mode=exam reviews the last mock (with the student's answers); otherwise ids=… lists practice questions. */
export default function Review() {
  const { mode, ids } = useLocalSearchParams<{ mode?: string; ids?: string }>();
  const { data } = useStore();
  const exam = mode === 'exam' ? data.activeExam : null;
  const [filter, setFilter] = useState<Filter>(exam ? 'wrong' : 'all');
  const all = exam ? exam.questionIds : (ids ?? '').split(',').filter(Boolean);
  const isWrong = (id: string) => exam && exam.answers[id] !== undefined && exam.answers[id] !== questionById(id)?.answerIndex;
  const shown = all.filter(id => filter === 'all' || (filter === 'wrong' && isWrong(id)) || (filter === 'flagged' && exam?.flagged[id]));
  const counts = exam ? { all: all.length, wrong: all.filter(isWrong).length, flagged: all.filter(id => exam.flagged[id]).length } : null;
  return (
    <Screen>
      <Row><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /><AkadaText variant="h2">Review answers</AkadaText></Row>
      {counts && (
        <Row gap={space[8]}>
          <Chip label={`All ${counts.all}`} selected={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label={`Wrong ${counts.wrong}`} selected={filter === 'wrong'} onPress={() => setFilter('wrong')} />
          <Chip label={`Flagged ${counts.flagged}`} selected={filter === 'flagged'} onPress={() => setFilter('flagged')} />
        </Row>
      )}
      {shown.length === 0 && (
        <EmptyState
          emoji="check"
          title={filter === 'flagged' ? 'No flagged questions' : filter === 'wrong' ? 'No wrong answers' : 'Nothing to review'}
          body={filter === 'flagged' ? 'You didn’t flag anything in this test. Flag questions during a mock test to find them here.' : 'Nice work. Nothing to go over here.'}
          action={counts && filter !== 'all' ? <Button label="See all questions" variant="ghost" size="small" onPress={() => setFilter('all')} /> : undefined}
        />
      )}
      {shown.map((id, n) => {
        const q = questionById(id); if (!q) return null;
        const m = subjectMeta(q.subjectId);
        const mine = exam?.answers[id];
        return (
          <Card key={id}>
            <Row><SubjectTag label={m.name} color={m.color} /><View style={{ flex: 1 }} /><AkadaText variant="labelSmall" color="textSecondary">Q{(exam ? exam.questionIds.indexOf(id) : n) + 1}</AkadaText></Row>
            <AkadaText variant="question">{q.text}</AkadaText>
            {exam && mine === undefined && <AkadaText variant="bodySmall" color="textSecondary">You didn’t answer this one.</AkadaText>}
            {exam && mine !== undefined && mine !== q.answerIndex && <AnswerOption letter={'ABCD'[mine]} text={`Your answer: ${q.options[mine]}`} state="Wrong" disabled />}
            <AnswerOption letter={'ABCD'[q.answerIndex]} text={`Correct: ${q.options[q.answerIndex]}`} state="Correct" disabled />
            <AkadaText variant="bodyMedium" color="textSecondary">{q.explanation}</AkadaText>
          </Card>
        );
      })}
    </Screen>
  );
}
