import { router } from 'expo-router';
import { BellIcon, ExamIcon, PlayIcon, WarningCircleIcon } from '@/components/icons';
import { View } from 'react-native';
import { AkadaIcon } from '@/components/AkadaIcon';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { SubjectTag } from '@/components/Chips';
import { Emoji, type EmojiName } from '@/components/Emoji';
import { IconButton } from '@/components/IconButton';
import { InstallHint } from '@/components/InstallHint';
import { Card, Columns, Grid, ListCard, Photo, Row, Screen, Stack } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { ProgressBar } from '@/components/Progress';
import { SubjectCard } from '@/components/SubjectCard';
import { bank, questionById, questionsFor, topicsFor } from '@/data/bank';
import { ENGLISH_ID } from '@/data/catalog';
import { images } from '@/data/images';
import { subjectMeta } from '@/data/subjectMeta';
import { accuracy, streak, subjectProgress, weakTopics } from '@/logic/progress';
import { localDate, useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';
import { radius, space, subjectColors, useTheme } from '@/theme/theme';

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

function Stat({ emoji, value, label, progress }: { emoji: EmojiName; value: string; label: string; progress?: number }) {
  return (
    <Card style={{ flex: 1 }} gap={space[8]}>
      <Emoji name={emoji} size={40} />
      <AkadaText variant="h2">{value}</AkadaText>
      {progress !== undefined && <ProgressBar value={progress} />}
      <AkadaText variant="bodySmall" color="textSecondary">{label}</AkadaText>
    </Card>
  );
}

export default function Home() {
  const { data } = useStore();
  const { c } = useTheme();
  const { size, wide, desktop } = useLayout();
  const p = data.profile!;
  const subjects = [ENGLISH_ID, ...p.subjects];
  const firstTime = data.sessions === 0;
  const firstCount = Math.min(10, questionsFor(ENGLISH_ID).length);
  const today = localDate();
  const days = streak(data.practiceDays, today);
  const minutes = data.today.date === today ? data.today.minutes : 0;
  // Subject cards: 2 per row on phones and tablets, all 4 in one row on computers.
  const subjectColumns = desktop ? 4 : 2;

  // "Continue where you left off": the topic of the most recently answered question.
  const last = Object.entries(data.history).sort((a, b) => b[1].at - a[1].at)[0];
  const lastQ = last ? questionById(last[0]) : undefined;
  const lastTopic = lastQ ? topicsFor(lastQ.subjectId).find(t => t.id === lastQ.topicId) : undefined;
  const topicQs = lastQ ? bank.questions.filter(q => q.topicId === lastQ.topicId) : [];
  const topicDone = topicQs.filter(q => data.history[q.id]).length;

  const header = (
    <Row>
      <Stack gap={space[4]} style={{ flex: 1 }}>
        <AkadaText variant="bodyMedium" color="textSecondary">{firstTime ? 'Welcome to Akada' : greeting()}</AkadaText>
        <Row gap={space[8]}><AkadaText variant="h1">{firstTime ? `Hi, ${p.name}` : p.name}</AkadaText><Emoji name="wave" size={32} /></Row>
      </Stack>
      <IconButton icon={BellIcon} label="Notifications" onPress={() => router.push('/notifications')} />
    </Row>
  );

  const subjectGrid = (
    <Stack gap={space[12]}>
      <AkadaText variant="h3">Your subjects</AkadaText>
      <Grid columns={subjectColumns}>
        {subjects.map(id => {
          const m = subjectMeta(id);
          const prog = subjectProgress(data.history, bank.questions, id);
          const status = prog === 0 ? (firstTime && id === ENGLISH_ID ? 'Start here' : 'Not started') : `${Math.round(prog * 100)}% complete`;
          return <SubjectCard key={id} title={m.name} subtitle={m.topicsLine} color={m.color} emoji={m.emoji} progress={prog} status={status} onPress={() => router.push({ pathname: '/practice/[subject]', params: { subject: id } })} />;
        })}
      </Grid>
    </Stack>
  );

  if (firstTime) {
    const steps = [
      { n: 1, title: `Answer your first ${firstCount} questions`, sub: `Today · about ${Math.max(1, Math.round(firstCount * 0.8))} min`, now: true },
      { n: 2, title: 'Try every subject once', sub: p.subjects.map(s => subjectMeta(s).name).join(', '), now: false },
      { n: 3, title: 'Take your first mock test', sub: 'Best after 3 practice sessions', now: false },
    ];
    const startText = (
      <Stack gap={space[12]} style={wide ? { flex: 1 } : undefined}>
        <AkadaText variant="labelSmall" color="textBrand">START HERE</AkadaText>
        <AkadaText variant={wide ? 'h1' : 'h2'}>Your first practice</AkadaText>
        <AkadaText variant={wide ? 'bodyLarge' : 'bodyMedium'} color="textSecondary">{firstCount} English questions · about {Math.max(1, Math.round(firstCount * 0.8))} minutes. Every answer comes with an explanation, so you learn as you go.</AkadaText>
        <View style={wide ? { alignSelf: 'flex-start' } : undefined}>
          <Button label="Start your first practice" block={!wide} onPress={() => router.push({ pathname: '/practice/session', params: { subject: ENGLISH_ID, first: '1' } })} />
        </View>
      </Stack>
    );
    return (
      <Screen tab>
        {header}
        <InstallHint />
        <Card tone="primaryContainer" style={{ borderColor: c.primary, borderWidth: 2, ...(wide ? { flexDirection: 'row', alignItems: 'center', gap: space[32], padding: space[24] } : null) }}>
          {wide ? (
            <>
              <View style={{ width: size === 'desktop' ? 420 : 280 }}><Photo source={images.study} height={size === 'desktop' ? 260 : 200} rounded="lg" /></View>
              {startText}
            </>
          ) : (
            <>
              <Photo source={images.study} height={150} rounded="md" />
              {startText}
            </>
          )}
        </Card>
        <Columns
          main={
            <Stack gap={space[12]}>
              <AkadaText variant="h3">Your first week</AkadaText>
              <Card gap={space[16]}>
                {steps.map(s => (
                  <Row key={s.n}>
                    <View style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: s.now ? c.primary : c.bgSunken }}>
                      <AkadaText variant="labelMedium" style={{ color: s.now ? c.textOnPrimary : c.textSecondary }}>{s.n}</AkadaText>
                    </View>
                    <Stack gap={space[4]} style={{ flex: 1 }}>
                      <AkadaText variant="labelLarge">{s.title}</AkadaText>
                      <AkadaText variant="bodySmall" color="textSecondary">{s.sub}</AkadaText>
                    </Stack>
                  </Row>
                ))}
              </Card>
            </Stack>
          }
          side={
            <Stack gap={space[12]}>
              {desktop && <AkadaText variant="h3">Build a daily habit</AkadaText>}
              <Card tone="warningContainer">
                <Row><Emoji name="fire" size={40} /><Stack gap={space[4]} style={{ flex: 1 }}><AkadaText variant="labelLarge">Start your streak today</AkadaText><AkadaText variant="bodySmall" color="textSecondary">Practise a little every day. Your goal is {p.dailyGoalMin} minutes.</AkadaText></Stack></Row>
              </Card>
            </Stack>
          }
        />
        {subjectGrid}
        <Card onPress={() => router.push('/(tabs)/mock')}>
          <Row><AkadaIcon icon={ExamIcon} /><Stack gap={space[4]} style={{ flex: 1 }}><AkadaText variant="labelLarge">Timed mock test</AkadaText><AkadaText variant="bodySmall" color="textSecondary">Recommended after 3 practice sessions. You can try it any time.</AkadaText></Stack></Row>
        </Card>
      </Screen>
    );
  }

  const acc = accuracy(data.history, bank.questions);
  const weak = weakTopics(data.history, bank.questions);
  const stats = [
    <Stat key="streak" emoji="fire" value={`${days} ${days === 1 ? 'day' : 'days'}`} label={days ? 'Current streak' : 'Practise today to start one'} />,
    <Stat key="goal" emoji="target" value={`${Math.min(minutes, p.dailyGoalMin)} / ${p.dailyGoalMin} min`} label="Today’s goal" progress={minutes / p.dailyGoalMin} />,
    // Wide screens have room for two more numbers from Progress.
    ...(wide ? [
      <Stat key="acc" emoji="chart" value={acc === null ? '–' : `${acc}%`} label="Accuracy" />,
      <Stat key="mocks" emoji="trophy" value={String(data.mocks.length)} label="Mock tests taken" />,
    ] : []),
  ];
  const mockCard = (
    <Card>
      <Photo source={images.cbt} height={desktop ? 160 : 150} rounded="md" />
      <AkadaText variant="h3">Timed mock test</AkadaText>
      <AkadaText variant="bodyMedium" color="textSecondary">English and your 3 subjects · new random questions every time.</AkadaText>
      <Button label="Start mock test" block onPress={() => router.push('/(tabs)/mock')} />
    </Card>
  );
  return (
    <Screen tab>
      {header}
      <InstallHint />
      <Grid columns={desktop ? 4 : 2}>{stats}</Grid>
      <Columns
        main={
          <>
            {lastQ && lastTopic && (
              <Stack gap={space[12]}>
                <AkadaText variant="h3">Continue where you left off</AkadaText>
                <Card onPress={() => router.push({ pathname: '/practice/session', params: { subject: lastQ.subjectId, topic: lastTopic.id } })}>
                  <Row><SubjectTag label={subjectMeta(lastQ.subjectId).name} color={subjectMeta(lastQ.subjectId).color} /><View style={{ flex: 1 }} /><AkadaText variant="bodySmall" color="textSecondary">{topicDone} of {topicQs.length} done</AkadaText></Row>
                  <AkadaText variant={desktop ? 'h2' : 'h3'}>{lastTopic.name}</AkadaText>
                  <ProgressBar value={topicDone / Math.max(topicQs.length, 1)} color={subjectColors(c, subjectMeta(lastQ.subjectId).color).strong} />
                  <Row><AkadaText variant="bodySmall" color="textSecondary" style={{ flex: 1 }}>{lastTopic.level} · Tap to keep going</AkadaText><IconButton icon={PlayIcon} label="Resume" variant="filled" onPress={() => router.push({ pathname: '/practice/session', params: { subject: lastQ.subjectId, topic: lastTopic.id } })} /></Row>
                </Card>
              </Stack>
            )}
            {subjectGrid}
            {!desktop && mockCard}
          </>
        }
        side={desktop ? (
          <>
            {mockCard}
            {weak.length > 0 && (
              <Stack gap={space[12]}>
                <AkadaText variant="h3">Weak topics</AkadaText>
                <ListCard>
                  {weak.map((w, i) => <ListRow key={w.topicId} label={`${subjectMeta(w.subjectId).name} · ${topicsFor(w.subjectId).find(t => t.id === w.topicId)?.name}`} value={`${w.accuracy}%`} icon={WarningCircleIcon} last={i === weak.length - 1} onPress={() => router.push({ pathname: '/practice/session', params: { subject: w.subjectId, topic: w.topicId } })} />)}
                </ListCard>
              </Stack>
            )}
          </>
        ) : null}
      />
    </Screen>
  );
}
