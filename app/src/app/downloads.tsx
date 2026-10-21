import { router } from 'expo-router';
import { ArrowLeftIcon, CheckCircleIcon } from '@/components/icons';
import { AkadaText } from '@/components/AkadaText';
import { IconButton } from '@/components/IconButton';
import { Card, ListCard, Row, Screen } from '@/components/Layout';
import { ListRow } from '@/components/ListRow';
import { bank, questionsFor } from '@/data/bank';
import { subjects } from '@/data/catalog';
import { THIS_DEVICE } from '@/theme/responsive';

/** Every question ships inside the app, so there is nothing to download: this screen just says so. */
export default function Downloads() {
  return (
    <Screen>
      <Row><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /><AkadaText variant="h2">Offline access</AkadaText></Row>
      <Card gap={8}>
        <AkadaText variant="labelLarge">Everything works without data</AkadaText>
        <AkadaText variant="bodyMedium" color="textSecondary">All {bank.questions.length.toLocaleString()} questions are saved inside the app, so you can practise and take mock tests in airplane mode. Your progress is saved on {THIS_DEVICE}.</AkadaText>
      </Card>
      <ListCard>
        {subjects.map((s, i) => <ListRow key={s.id} label={s.name} value={`${questionsFor(s.id).length} questions`} icon={CheckCircleIcon} chevron={false} last={i === subjects.length - 1} />)}
      </ListCard>
    </Screen>
  );
}
