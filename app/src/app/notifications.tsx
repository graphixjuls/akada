import { router } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { AkadaText } from '@/components/AkadaText';
import { EmptyState } from '@/components/Feedback';
import { IconButton } from '@/components/IconButton';
import { Row, Screen } from '@/components/Layout';

export default function Notifications() {
  return (
    <Screen>
      <Row><IconButton icon={ArrowLeftIcon} label="Back" onPress={() => router.back()} /><AkadaText variant="h2">Notifications</AkadaText></Row>
      <EmptyState emoji="bell" title="You're all caught up" body="Reminders and streak alerts will show up here." />
    </Screen>
  );
}
