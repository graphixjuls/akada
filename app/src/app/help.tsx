import { router } from 'expo-router';
import { Linking } from 'react-native';
import { ArrowLeftIcon, FlagIcon, LightbulbIcon, WarningCircleIcon } from '@/components/icons';
import { AkadaText } from '@/components/AkadaText';
import { Card, Columns, ListCard, Row, Screen, Stack } from '@/components/Layout';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { MOCK_FORMAT } from '@/data/catalog';
import { THIS_DEVICE } from '@/theme/responsive';
import { space } from '@/theme/theme';

/** Feedback goes to the public GitHub issues page: Akada itself sends nothing anywhere. */
const ISSUES_URL = 'https://github.com/graphixjuls/akada/issues/new';
const issue = (title: string) => Linking.openURL(`${ISSUES_URL}?title=${encodeURIComponent(title)}`);

const FAQ: [string, string][] = [
  ['How does practice work?', 'Pick a subject, then a topic, or start a quick practice. You get 10 questions at a time. Check each answer to see if it’s right and read the explanation. Questions you haven’t answered yet come first.'],
  ['How do mock tests work?', `Choose which of your subjects to include. Each one gets ${MOCK_FORMAT.questionsPerSubject} random questions and about ${MOCK_FORMAT.secondsPerQuestion} seconds per question. The timer keeps running if you leave, and the test submits itself when time runs out.`],
  ['Can I change my subjects?', 'Yes, as many times as you like. Go to Profile, then My subjects, then Change. No subject is compulsory.'],
  ['Do I need the internet?', 'No. All the questions are inside Akada, so practice and mock tests work offline.'],
  ['Where is my progress saved?', `Only on ${THIS_DEVICE}. There’s no account, so your progress doesn’t move to another phone or browser. Reset progress in Profile deletes it.`],
  ['Is this the real exam?', 'No. These are original practice questions built around common SS1 to SS3 topics. Always check your school’s scheme of work.'],
];

export default function Help() {
  const faq = (
    <Stack gap={space[12]}>
      <AkadaText variant="h3">Common questions</AkadaText>
      {FAQ.map(([q, a]) => (
        <Card key={q} gap={space[8]}>
          <AkadaText variant="labelLarge">{q}</AkadaText>
          <AkadaText variant="bodyMedium" color="textSecondary">{a}</AkadaText>
        </Card>
      ))}
    </Stack>
  );
  const feedback = (
    <Stack gap={space[12]}>
      <AkadaText variant="h3">Send feedback</AkadaText>
      <AkadaText variant="bodyMedium" color="textSecondary">Feedback opens on GitHub, where Akada is built in the open. You need a free GitHub account to post.</AkadaText>
      <ListCard>
        <ListRow label="Report a wrong question" icon={FlagIcon} onPress={() => issue('Wrong question: ')} />
        <ListRow label="Report a problem" icon={WarningCircleIcon} onPress={() => issue('Problem: ')} />
        <ListRow label="Suggest an idea" icon={LightbulbIcon} last onPress={() => issue('Idea: ')} />
      </ListCard>
      <AkadaText variant="bodySmall" color="textTertiary">For a wrong question, include the subject, the topic and the question text.</AkadaText>
    </Stack>
  );
  return (
    <Screen>
      <Row><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /><AkadaText variant="h2">Help and feedback</AkadaText></Row>
      <Columns sideWidth={400} main={faq} side={feedback} />
    </Screen>
  );
}
