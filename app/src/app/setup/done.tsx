import { router } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { AkadaText } from '@/components/AkadaText';
import { Button } from '@/components/Button';
import { SubjectTag, Wrap } from '@/components/Chips';
import { Photo, Screen, Stack } from '@/components/Layout';
import { subjectById } from '@/data/catalog';
import { images } from '@/data/images';
import { useStore } from '@/store/AppStore';
import { useLayout } from '@/theme/responsive';

export default function AllSet() {
  const { data, completeOnboarding } = useStore();
  const { height } = useWindowDimensions();
  const { desktop } = useLayout();
  const d = data.draft;
  const subjects = (d.subjects ?? []);
  return (
    <Screen width="form" aside={images.allSet} footer={<Button label="Start practising" block onPress={() => { completeOnboarding(); router.replace('/(tabs)'); }} />}>
      {!desktop && <Photo source={images.allSet} height={Math.max(240, height * 0.4)} />}
      <Stack>
        <AkadaText variant="h1">You’re all set, {d.name || 'friend'}!</AkadaText>
        <AkadaText variant="bodyLarge" color="textSecondary">Your first {d.dailyGoalMin ?? 30}-minute session is ready.{d.examDate && d.examDate !== 'Not set yet' ? ` Exam day: ${d.examDate}.` : ''}</AkadaText>
      </Stack>
      <Wrap>{subjects.map(id => { const s = subjectById(id); return s ? <SubjectTag key={id} label={s.name} color={s.color} /> : null; })}</Wrap>
    </Screen>
  );
}
